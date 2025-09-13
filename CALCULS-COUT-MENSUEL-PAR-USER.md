# 💰 Calcul du Coût Mensuel par Utilisateur - Explication Détaillée

## 🎯 Vue d'Ensemble

Le coût mensuel par utilisateur est calculé en divisant le **coût total mensuel** par le **nombre d'utilisateurs**. Mais ce calcul a plusieurs variantes selon le contexte.

## 📊 Types de Calculs

### **1. Coût Moyen Global** (bloc "💰 Coût/Employé Global")
```javascript
const avgCostMonthly = totalUsers > 0 ? totalCost / totalUsers : 0;
```

**Formule :** `Coût Total Mensuel ÷ Nombre Total d'Utilisateurs Actifs`

### **2. Coût Moyen Interne** (bloc "👤 Coût/Employé Interne")
```javascript
const avgInternalCostMonthly = internalUsers.length > 0 ? internalCost / internalUsers.length : 0;
```

**Formule :** `(Coût Total - Coût Externes) ÷ Nombre d'Utilisateurs Internes`

### **3. Coût Moyen Externe** (bloc "🏢 Coût/Employé Externe")
```javascript
const avgExternalCostMonthly = externalUsers.length > 0 ? externalCost / externalUsers.length : 0;
```

**Formule :** `Coût des Utilisateurs Externes ÷ Nombre d'Utilisateurs Externes`

### **4. Coût Moyen par Équipe** (dans les cartes d'équipe)
```javascript
const avgCostPerEmployee = teamStats.totalUsers > 0 ? teamStats.monthlyCost / teamStats.totalUsers : 0;
```

**Formule :** `Coût Total de l'Équipe ÷ Nombre d'Utilisateurs dans l'Équipe`

## 🔧 Comment est Calculé le Coût Total Mensuel ?

### **Étape 1 : Coûts Fixes**
```javascript
software.forEach(soft => {
    if (soft.cout_fixe && soft.cout_fixe_mensuel) {
        totalCost += soft.cout_fixe_mensuel; // Ajouté UNE SEULE FOIS
    }
});
```

**Principe :** Les logiciels à coût fixe (ex: Jira Enterprise, Office 365) sont comptés une seule fois, peu importe le nombre d'utilisateurs.

### **Étape 2 : Coûts Variables (Accès)**
```javascript
for (const acc of access) {
    const cost = costs.find(c => c.logiciel_id === acc.logiciel_id && c.droit_id === acc.droit_id);
    
    if (droit.nom === 'Accès communs') {
        // Compté UNE SEULE FOIS par logiciel
        if (!processedSharedAccess.has(sharedKey)) {
            totalCost += cost.cout_mensuel;
        }
    } else {
        // Compté POUR CHAQUE UTILISATEUR
        totalCost += cost.cout_mensuel;
    }
}
```

**Principe :** 
- **Accès individuels** : Multiplié par le nombre d'utilisateurs qui ont cet accès
- **Accès communs** : Compté une seule fois par logiciel
- **Coût fixe + Variable** : Les logiciels à coût fixe peuvent aussi avoir des coûts variables (cumul)

## 📋 Exemple Concret

### **Données d'Exemple :**
- **Utilisateurs :** 10 internes + 3 externes = **13 total**
- **Logiciels :**
  - Slack Pro : 5€/mois par utilisateur → 13 × 5€ = **65€**
  - Jira Enterprise : Coût fixe 200€/mois → **200€**
  - Shopify Pro : 29€/mois (accès commun) → **29€**

### **Calcul Total :**
```
Coût Total Mensuel = 65€ + 200€ + 29€ = 294€
```

### **Calculs par Type d'Utilisateur :**

**Coût Moyen Global :**
```
294€ ÷ 13 utilisateurs = 22,62€/mois/utilisateur
```

**Coût Moyen Interne :**
```
Si les externes coûtent 50€ au total → (294€ - 50€) ÷ 10 = 24,40€/mois/utilisateur interne
```

**Coût Moyen Externe :**
```
50€ ÷ 3 = 16,67€/mois/utilisateur externe
```

## 🎯 Cas Particuliers

### **1. Répartition des Coûts Fixes par Équipe**
Pour les équipes, les coûts fixes sont répartis différemment selon le contexte :
- **Dashboard global** : Coût fixe complet
- **Vue équipe** : Coût fixe réparti proportionnellement entre les équipes qui utilisent le logiciel

### **2. Utilisateurs Externes**
Les utilisateurs externes peuvent avoir :
- Des logiciels spécifiques (comptés dans leur coût)
- Accès à des logiciels communs (répartis globalement)

### **3. Accès Multiples**
Un utilisateur peut avoir plusieurs accès au même logiciel (ex: Admin + Utilisateur) → chaque accès est compté séparément.

## ⚖️ Logique Métier

### **Pourquoi cette Méthode ?**
1. **Coûts fixes réalistes** : Un abonnement Office 365 Enterprise coûte pareil pour 1 ou 1000 utilisateurs
2. **Granularité des accès** : Différents types d'accès ont des coûts différents
3. **Répartition équitable** : Les coûts communs sont répartis sur tous les bénéficiaires
4. **Analyse par segment** : Distinction interne/externe pour l'analyse budgétaire

### **Avantages :**
✅ **Précision** : Calcul au centime près  
✅ **Flexibilité** : Gère tous les modèles de tarification  
✅ **Transparence** : Chaque coût est traçable  
✅ **Évolutivité** : S'adapte à la croissance de l'entreprise

Cette méthode offre une vision claire et précise des coûts IT par utilisateur, essentielle pour la gestion budgétaire et l'optimisation des licences ! 💡