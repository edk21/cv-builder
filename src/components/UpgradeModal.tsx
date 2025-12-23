"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: "save" | "download" | "duplicate" | "create";
}

export function UpgradeModal({
  open,
  onOpenChange,
  reason = "create",
}: UpgradeModalProps) {
  const messages = {
    save: "Passez à Premium pour sauvegarder des CVs illimités",
    download: "Passez à Premium pour télécharger tous vos CVs",
    duplicate: "Passez à Premium pour dupliquer vos CVs",
    create: "Passez à Premium pour créer des CVs illimités",
  };

  const handleUpgrade = () => {
    // TODO: Implement payment flow with Stripe/Paddle
    alert("Fonctionnalité de paiement à venir !");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Passez à Premium
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {messages[reason]}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-lg">CV Crafter Premium</h3>
            </div>

            <ul className="space-y-3">
              {[
                "CVs illimités",
                "Tous les templates premium",
                "Export PDF haute qualité",
                "Support prioritaire",
                "Personnalisation avancée",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 text-center">
              <div className="text-3xl font-bold text-purple-600">9.99€</div>
              <div className="text-sm text-slate-600">par mois</div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button
            onClick={handleUpgrade}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Passer à Premium
          </Button>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Peut-être plus tard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
