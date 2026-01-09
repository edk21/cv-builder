import { NextRequest, NextResponse } from "next/server";
import { CVData } from "@/types/cv";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { checkSubscriptionLimits } from "@/lib/subscriptionService";
import { generatePDFBuffer } from "@/lib/pdfGenerator";

// Force Node.js runtime
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Authenticate the user
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Non autorisé. Veuillez vous connecter." },
        { status: 401 }
      );
    }

    const cvData: CVData = await request.json();

    // If this is a saved CV (has an ID), verify ownership and check access
    if (cvData.id) {
      // Verify ownership
      const { data: existingCV } = await supabase
        .from("cvs")
        .select("user_id")
        .eq("id", cvData.id)
        .single();

      if (!existingCV || existingCV.user_id !== user.id) {
        return NextResponse.json(
          { error: "Non autorisé. Ce CV ne vous appartient pas." },
          { status: 403 }
        );
      }

      // Check subscription limits
      const limits = await checkSubscriptionLimits(user.id);

      // Get all user CVs to determine the index of this CV
      const { data: userCVs } = await supabase
        .from("cvs")
        .select("id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      const cvIndex = userCVs?.findIndex((cv) => cv.id === cvData.id) ?? -1;

      // Free users can only download their first CV (index 0)
      if (!limits.isPremium && cvIndex > 0) {
        return NextResponse.json(
          {
            error: "Téléchargement non autorisé",
            message:
              "Vous ne pouvez télécharger que votre premier CV en version gratuite. Passez à Premium pour télécharger tous vos CVs.",
          },
          { status: 403 }
        );
      }
    }

    // Generate PDF
    console.log("Starting PDF generation...");
    const buffer = await generatePDFBuffer(cvData);
    console.log("PDF generated successfully, size:", buffer.length);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(cvData.name || "cv")}.pdf"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("PDF API Route Error:", error);
    return NextResponse.json(
      { 
        error: "Erreur lors de la génération du PDF", 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}

