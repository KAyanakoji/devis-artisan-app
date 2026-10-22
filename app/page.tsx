"use client";

import { useState } from "react";

interface Item {
  designation: string;
  quantite: number;
  prixUnitaire: number;
}

export default function Home() {
  const [description, setDescription] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [normes, setNormes] = useState("");

  const toggleListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("La dictée vocale n'est pas supportée par votre navigateur. Utilisez Chrome ou Edge.");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = true;

    if (!isListening) {
      recognition.start();
      setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        setDescription(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
    } else {
      setIsListening(false);
    }
  };

  const handleGenerateDevis = () => {
    const text = description.toLowerCase();
    const detectedItems: Item[] = [];
    let detectedNormes = "";

    if (text.includes("tableau") || text.includes("disjoncteur")) {
      detectedItems.push({ designation: "Fourniture et pose de Tableau Électrique", quantite: 1, prixUnitaire: 450 });
      detectedNormes += "• Norme NF C 15-100 : Protection des circuits et accessibilité du tableau.\n";
    }

    if (text.includes("prise") || text.includes("rj45") || text.includes("reseau") || text.includes("réseau")) {
      detectedItems.push({ designation: "Pose et raccordement de prise RJ45", quantite: 4, prixUnitaire: 65 });
      detectedNormes += "• Norme ISO/IEC 11801 : Câblage structuré pour réseaux de communication.\n";
    }

    if (text.includes("eclairage") || text.includes("lumiere") || text.includes("spot")) {
      detectedItems.push({ designation: "Installation de points d'éclairage / spots", quantite: 3, prixUnitaire: 50 });
    }

    if (detectedItems.length === 0) {
      detectedItems.push({ designation: "Forfait main d'œuvre et diagnostic", quantite: 1, prixUnitaire: 120 });
      detectedNormes += "• Respect des règles de l'art et DTU en vigueur.\n";
    }

    setItems(detectedItems);
    setNormes(detectedNormes);
  };

  const totalHT = items.reduce((acc, item) => acc + item.quantite * item.prixUnitaire, 0);
  const totalTTC = totalHT * 1.20;

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* En-tête du site */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-6 gap-4">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-blue-400 bg-blue-950 px-3 py-1 rounded-full border border-blue-800">
              SaaS B2B Artisans
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-2 text-white">
              DevisPro <span className="text-blue-500">IA</span>
            </h1>
          </div>
          <p className="text-sm text-slate-400 max-w-xs">
            Générez vos devis et rappels normatifs instantanément par la voix.
          </p>
        </header>

        {/* Bloc de saisie principal */}
        <div className="bg-slate-800/60 backdrop-blur border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200">
              Description du chantier :
            </label>
            <p className="text-xs text-slate-400">
              Exemple : &quot;Il faut poser un tableau électrique et 4 prises réseau RJ45&quot;
            </p>
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-4 bg-slate-900/80 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-100 placeholder-slate-500 text-sm transition"
            placeholder="Cliquez sur le micro pour dicter vos besoins..."
          />

          <div className="flex flex-wrap gap-4 items-center justify-between">
            <button
              onClick={toggleListening}
              className={`px-5 py-3 rounded-xl font-medium transition flex items-center gap-3 text-sm shadow-md ${
                isListening
                  ? "bg-red-600 text-white animate-pulse shadow-red-900/50"
                  : "bg-slate-700 text-white hover:bg-slate-600 border border-slate-600"
              }`}
            >
              <span className="text-lg">🎤</span> {isListening ? "Écoute en cours..." : "Dicter à la voix"}
            </button>

            <button
              onClick={handleGenerateDevis}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <span>⚡ Générer le chiffrage</span>
            </button>
          </div>
        </div>

        {/* Section Devis Généré */}
        {items.length > 0 && (
          <div className="bg-slate-800/60 backdrop-blur border border-slate-700/60 rounded-2xl p-6 shadow-xl space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-700 pb-4">
              <h2 className="text-xl font-bold text-white">Chiffrage & Normes Estimés</h2>
              <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-full">
                Prêt à envoyer
              </span>
            </div>

            {/* Tableau des prestations */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400">
                    <th className="p-3 font-semibold">Désignation des travaux</th>
                    <th className="p-3 font-semibold text-center">Qté</th>
                    <th className="p-3 font-semibold text-right">P.U. HT</th>
                    <th className="p-3 font-semibold text-right">Total HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {items.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-700/30 transition">
                      <td className="p-3 text-slate-200">{item.designation}</td>
                      <td className="p-3 text-center text-slate-300">{item.quantite}</td>
                      <td className="p-3 text-right text-slate-300">{item.prixUnitaire} €</td>
                      <td className="p-3 text-right font-medium text-white">{item.quantite * item.prixUnitaire} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totaux */}
            <div className="flex flex-col items-end space-y-1.5 pt-4 border-t border-slate-700 text-sm">
              <div className="flex justify-between w-48 text-slate-400">
                <span>Total HT :</span>
                <span className="text-white font-medium">{totalHT} €</span>
              </div>
              <div className="flex justify-between w-48 text-slate-400">
                <span>TVA (20%) :</span>
                <span className="text-white font-medium">{(totalHT * 0.20).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between w-48 text-lg font-bold text-blue-400 pt-2 border-t border-slate-700">
                <span>Total TTC :</span>
                <span>{totalTTC.toFixed(2)} €</span>
              </div>
            </div>

            {/* Encadré Normes */}
            {normes && (
              <div className="bg-amber-950/40 border border-amber-800/60 p-4 rounded-xl text-amber-200 text-xs sm:text-sm space-y-1">
                <div className="font-bold flex items-center gap-2 text-amber-300">
                  <span>⚠️</span> Rappels réglementaires & Cahier des charges :
                </div>
                <pre className="whitespace-pre-wrap font-sans text-amber-100/90 pl-5">{normes}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}