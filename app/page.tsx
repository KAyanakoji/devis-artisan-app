"use client";

import { useState } from "react";

// Définition d'un type pour les lignes du devis
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

  // Fonction d'analyse basique pour simuler l'intelligence du devis
  const handleGenerateDevis = () => {
    const text = description.toLowerCase();
    const detectedItems: Item[] = [];
    let detectedNormes = "";

    // Analyse simple par mots-clés
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

    // Si rien n'est détecté, on met un forfait par défaut
    if (detectedItems.length === 0) {
      detectedItems.push({ designation: "Forfait main d'œuvre et diagnostic", quantite: 1, prixUnitaire: 120 });
      detectedNormes += "• Respect des règles de l'art et DTU en vigueur.\n";
    }

    setItems(detectedItems);
    setNormes(detectedNormes);
  };

  const totalHT = items.reduce((acc, item) => acc + item.quantite * item.prixUnitaire, 0);
  const totalTTC = totalHT * 1.20; // TVA 20%

  return (
    <main className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 border border-slate-200 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Générateur de Devis & Cahier des Charges
          </h1>
          <p className="text-slate-600 text-sm">
            Dictez vos travaux (ex: "Il faut poser un tableau électrique et 4 prises réseau RJ45").
          </p>
        </div>

        {/* Zone de saisie / dictée */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Description du besoin :
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900"
            placeholder="Cliquez sur le micro ou écrivez ici..."
          />

          <div className="flex gap-4">
            <button
              onClick={toggleListening}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                isListening
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-slate-800 text-white hover:bg-slate-700"
              }`}
            >
              🎤 {isListening ? "Arrêter" : "Dicter à la voix"}
            </button>

            <button
              onClick={handleGenerateDevis}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Générer le devis automatique
            </button>
          </div>
        </div>

        {/* Affichage du Devis généré */}
        {items.length > 0 && (
          <div className="mt-8 border-t pt-6 space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Chiffrage et Normes Estimés</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="p-3 border">Désignation</th>
                    <th className="p-3 border text-center">Quantité</th>
                    <th className="p-3 border text-right">P.U. HT (€)</th>
                    <th className="p-3 border text-right">Total HT (€)</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="text-slate-700">
                      <td className="p-3 border">{item.designation}</td>
                      <td className="p-3 border text-center">{item.quantite}</td>
                      <td className="p-3 border text-right">{item.prixUnitaire} €</td>
                      <td className="p-3 border text-right">{item.quantite * item.prixUnitaire} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end space-y-1 flex-col text-right text-slate-800">
              <p>Total HT : <span className="font-bold">{totalHT} €</span></p>
              <p>TVA (20%) : <span className="font-bold">{(totalHT * 0.20).toFixed(2)} €</span></p>
              <p className="text-lg font-bold text-blue-600">Total TTC : {totalTTC.toFixed(2)} €</p>
            </div>

            {/* Encadré Normes */}
            {normes && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-amber-900 text-sm">
                <h3 className="font-bold mb-1">Rappels des Normes & Cahier des Charges :</h3>
                <pre className="whitespace-pre-wrap font-sans">{normes}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}