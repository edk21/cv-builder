import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { CVData, CVDBSchema } from "@/types/cv";
import { NextRequest, NextResponse } from "next/server";
import { checkSubscriptionLimits } from "@/lib/subscriptionService";

// HELPERS: Adapter functions to transform between DB and Frontend types

// Helper function to handle missing columns by retrying without them
async function insertWithFallback(
  supabase: any,
  payload: Record<string, any>,
  maxRetries = 5
): Promise<{ data: any; error: any }> {
  let currentPayload = { ...payload };
  let lastError: any = null;

  // Essential columns that should never be removed (required for table structure)
  const essentialColumns = new Set([
    "user_id",
    "id",
    "created_at",
    "updated_at",
  ]);

  // Columns that are likely to exist in any CV table structure
  // If these are missing, the table structure is too different
  const likelyExistingColumns = new Set(["user_id", "updated_at"]);

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const { data, error } = await supabase
      .from("cvs")
      .insert(currentPayload)
      .select()
      .single();

    if (!error) {
      return { data, error: null };
    }

    // If it's a missing column error, remove that column and retry
    if (error.code === "PGRST204" && error.message) {
      // Try multiple regex patterns to extract column name
      // Error format: "Could not find the 'certifications' column of 'cvs' in the schema cache"
      const patterns = [
        /'(\w+)' column/i, // 'name' column (most common format)
        /column ['"](\w+)['"]/i, // column 'name' or column "name"
        /column (\w+)/i, // column name
      ];

      let missingColumn: string | null = null;
      for (const pattern of patterns) {
        const match = error.message.match(pattern);
        if (match && match[1]) {
          missingColumn = match[1];
          break;
        }
      }

      if (missingColumn) {
        // Don't remove essential columns - if an essential column is missing, the schema is too different
        if (
          essentialColumns.has(missingColumn) ||
          likelyExistingColumns.has(missingColumn)
        ) {
          // Create a more helpful error message
          const helpfulError = {
            ...error,
            message: `La structure de la table 'cvs' ne correspond pas au schéma attendu. La colonne '${missingColumn}' est manquante. Veuillez exécuter le script de migration SQL (supabase/fix_columns.sql) pour mettre à jour la structure de la base de données.`,
          };
          return { data: null, error: helpfulError };
        }

        // Remove the missing column (handle both snake_case and camelCase)
        const snakeCaseColumn = missingColumn;
        const camelCaseColumn = snakeCaseColumn
          .split("_")
          .map((word: string, i: number) =>
            i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
          )
          .join("");

        delete currentPayload[snakeCaseColumn];
        delete currentPayload[camelCaseColumn];

        lastError = error;
        continue;
      }
    }

    // If it's not a missing column error, return it
    return { data: null, error };
  }

  return { data: null, error: lastError };
}

async function updateWithFallback(
  supabase: any,
  payload: Record<string, any>,
  id: string,
  maxRetries = 5
): Promise<{ data: any; error: any }> {
  let currentPayload = { ...payload };
  let lastError: any = null;

  // Essential columns that should never be removed (required for table structure)
  const essentialColumns = new Set([
    "user_id",
    "id",
    "created_at",
    "updated_at",
  ]);

  // Columns that are likely to exist in any CV table structure
  // If these are missing, the table structure is too different
  const likelyExistingColumns = new Set(["user_id", "updated_at"]);

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const { data, error } = await supabase
      .from("cvs")
      .update(currentPayload)
      .eq("id", id)
      .select()
      .single();

    if (!error) {
      return { data, error: null };
    }

    // If it's a missing column error, remove that column and retry
    if (error.code === "PGRST204" && error.message) {
      // Try multiple regex patterns to extract column name
      // Error format: "Could not find the 'certifications' column of 'cvs' in the schema cache"
      const patterns = [
        /'(\w+)' column/i, // 'name' column (most common format)
        /column ['"](\w+)['"]/i, // column 'name' or column "name"
        /column (\w+)/i, // column name
      ];

      let missingColumn: string | null = null;
      for (const pattern of patterns) {
        const match = error.message.match(pattern);
        if (match && match[1]) {
          missingColumn = match[1];
          break;
        }
      }

      if (missingColumn) {
        // Don't remove essential columns - if an essential column is missing, the schema is too different
        if (
          essentialColumns.has(missingColumn) ||
          likelyExistingColumns.has(missingColumn)
        ) {
          // Create a more helpful error message
          const helpfulError = {
            ...error,
            message: `La structure de la table 'cvs' ne correspond pas au schéma attendu. La colonne '${missingColumn}' est manquante. Veuillez exécuter le script de migration SQL (supabase/fix_columns.sql) pour mettre à jour la structure de la base de données.`,
          };
          return { data: null, error: helpfulError };
        }

        // Remove the missing column
        const snakeCaseColumn = missingColumn;
        const camelCaseColumn = snakeCaseColumn
          .split("_")
          .map((word: string, i: number) =>
            i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
          )
          .join("");

        delete currentPayload[snakeCaseColumn];
        delete currentPayload[camelCaseColumn];

        lastError = error;
        continue;
      }
    }

    // If it's not a missing column error, return it
    return { data: null, error };
  }

  return { data: null, error: lastError };
}

function mapDBToCV(dbCV: CVDBSchema): CVData {
  try {
    return {
      id: dbCV.id,
      userId: dbCV.user_id,
      name: dbCV.name || "Mon CV",
      templateId: dbCV.template_id || "modern",
      themeColor: dbCV.theme_color || "#2563eb",
      personalInfo: dbCV.personal_info || {},
      experiences: Array.isArray(dbCV.experiences) ? dbCV.experiences : [],
      education: Array.isArray(dbCV.education) ? dbCV.education : [],
      skills: Array.isArray(dbCV.skills) ? dbCV.skills : [],
      projects: Array.isArray(dbCV.projects) ? dbCV.projects : [],
      languages: Array.isArray(dbCV.languages) ? dbCV.languages : [],
      certifications: Array.isArray(dbCV.certifications)
        ? dbCV.certifications
        : [],
      createdAt: dbCV.created_at,
      updatedAt: dbCV.updated_at,
    };
  } catch (error) {
    console.error("Error mapping DB to CV:", error, dbCV);
    throw new Error("Erreur lors du mapping des données");
  }
}

// GET - List all CVs or get a single CV
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const listView = searchParams.get("list") === "true";

    if (id) {
      const { data, error } = await supabase
        .from("cvs")
        .select("*")
        .eq("user_id", user.id)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching CV:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(mapDBToCV(data as unknown as CVDBSchema));
    }

    // Optimize for list view: only fetch necessary fields
    // This reduces payload size by ~80-90% for dashboard
    const selectFields = listView
      ? "id, user_id, name, template_id, theme_color, updated_at, created_at"
      : "*";

    const { data, error } = await supabase
      .from("cvs")
      .select(selectFields)
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching CVs:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formattedCVs = (data as unknown as CVDBSchema[]).map(mapDBToCV);
    return NextResponse.json(formattedCVs);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST - Create a new CV
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Check subscription limits before creating new CV
    const limits = await checkSubscriptionLimits(user.id);

    if (!limits.canSaveCV) {
      return NextResponse.json(
        {
          error: "Limite atteinte",
          message:
            "Vous avez atteint la limite de CVs pour votre abonnement gratuit. Passez à Premium pour créer des CVs illimités.",
          isPremium: limits.isPremium,
          cvCount: limits.cvCount,
          cvLimit: limits.cvLimit,
        },
        { status: 403 }
      );
    }

    const body = (await request.json()) as CVData;

    // Construct the DB payload with separate columns
    // Support both old schema (title) and new schema (name)
    const cvName = body.name || "Mon CV";
    const dbPayload = {
      user_id: user.id,
      name: cvName,
      title: cvName, // Support old schema with 'title' column
      template_id: body.templateId || "modern",
      template_key: body.templateId || "modern", // Support old schema
      theme_color: body.themeColor || "#2563eb",
      theme: body.themeColor
        ? { color: body.themeColor }
        : { color: "#2563eb" }, // Support old schema
      personal_info: body.personalInfo || {},
      experiences: body.experiences || [],
      education: body.education || [],
      skills: body.skills || [],
      projects: body.projects || [],
      languages: body.languages || [],
      certifications: body.certifications || [],
      updated_at: new Date().toISOString(),
    };

    // Use fallback function to handle missing columns
    const { data, error } = await insertWithFallback(supabase, dbPayload);

    if (error) {
      console.error("Error inserting CV:", error);
      return NextResponse.json(
        {
          error: `Erreur de base de données: ${error.message}. Veuillez exécuter la migration SQL (supabase/fix_columns.sql) pour ajouter les colonnes manquantes.`,
        },
        { status: 500 }
      );
    }

    if (!data) {
      console.error("No data returned from insert");
      return NextResponse.json(
        { error: "Aucune donnée retournée" },
        { status: 500 }
      );
    }

    return NextResponse.json(mapDBToCV(data as CVDBSchema));
  } catch (error) {
    console.error("Server error in POST:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// PUT - Update a CV
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = (await request.json()) as CVData;
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    // Verify ownership
    const { data: existingCV } = await supabase
      .from("cvs")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!existingCV || existingCV.user_id !== user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    // Check subscription limits and CV access
    const limits = await checkSubscriptionLimits(user.id);

    // Get all user CVs ordered by creation date to determine CV index
    const { data: userCVs } = await supabase
      .from("cvs")
      .select("id, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    const cvIndex = userCVs?.findIndex((cv) => cv.id === id) ?? -1;

    // Free users can only edit/save their first two CVs (index 0 and 1)
    // CVs with index > 1 are in preview mode for free users
    if (!limits.isPremium && cvIndex > 1) {
      return NextResponse.json(
        {
          error: "Modification non autorisée",
          message:
            "Vous ne pouvez modifier que vos deux premiers CVs en version gratuite. Passez à Premium pour accéder à tous vos CVs.",
        },
        { status: 403 }
      );
    }

    // Support both old schema (title) and new schema (name)
    const cvName = body.name || "Mon CV";
    const dbPayload = {
      name: cvName,
      title: cvName, // Support old schema with 'title' column
      template_id: body.templateId,
      template_key: body.templateId, // Support old schema
      theme_color: body.themeColor,
      theme: body.themeColor ? { color: body.themeColor } : undefined, // Support old schema
      personal_info: body.personalInfo,
      experiences: body.experiences,
      education: body.education,
      skills: body.skills,
      projects: body.projects,
      languages: body.languages,
      certifications: body.certifications,
      updated_at: new Date().toISOString(),
    };

    // Use fallback function to handle missing columns
    const { data, error } = await updateWithFallback(supabase, dbPayload, id);

    if (error) {
      console.error("Error updating CV:", error);
      return NextResponse.json(
        {
          error: `Erreur de base de données: ${error.message}. Veuillez exécuter la migration SQL (supabase/fix_columns.sql) pour ajouter les colonnes manquantes.`,
        },
        { status: 500 }
      );
    }

    if (!data) {
      console.error("No data returned from update");
      return NextResponse.json(
        { error: "Aucune donnée retournée" },
        { status: 500 }
      );
    }

    return NextResponse.json(mapDBToCV(data as CVDBSchema));
  } catch (error) {
    console.error("Server error in PUT:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur serveur";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// DELETE - Delete a CV
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    // Verify ownership
    const { data: existingCV } = await supabase
      .from("cvs")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!existingCV || existingCV.user_id !== user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const { error } = await supabase.from("cvs").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
