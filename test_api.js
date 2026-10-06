/**
 * Script de test E2E automatisé pour l'API MachineCare
 * Exécution : node test_api.js
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
let token = null;
let machineId = null;
let machineSansIncidentId = null;
let incidentId = null;

let passedCount = 0;
let failedCount = 0;

const logPass = (title) => {
  console.log(`\x1b[32m  ✔ [PASS]\x1b[0m ${title}`);
  passedCount++;
};

const logFail = (title, details) => {
  console.log(`\x1b[31m  ✖ [FAIL]\x1b[0m ${title}`);
  if (details) console.log(`         \x1b[33mDétails:\x1b[0m`, details);
  failedCount++;
};

const runRequest = async (name, url, options, expectedStatus) => {
  try {
    const res = await fetch(url, options);
    const data = await res.json().catch(() => ({}));

    if (res.status === expectedStatus) {
      logPass(`${name} (HTTP ${res.status})`);
      return { ok: true, data, status: res.status };
    } else {
      logFail(`${name} - Statut attendu: ${expectedStatus}, Reçu: ${res.status}`, data);
      return { ok: false, data, status: res.status };
    }
  } catch (err) {
    logFail(`${name} - Erreur réseau ou serveur inaccessible`, err.message);
    return { ok: false, error: err.message };
  }
};

const runAllTests = async () => {
  console.log('\n========================================================');
  console.log('       TEST AUTOMATISÉ MACHINECARE API (E2E)            ');
  console.log('========================================================\n');

  // 1. Authentification
  console.log('\x1b[36m--- 1. Authentification & Profil ---\x1b[0m');
  
  const loginRes = await runRequest(
    '1.1 Connexion avec compte admin initial',
    `${BASE_URL}/api/auth/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'khadija@gmail.com', password: 'khadija' })
    },
    200
  );

  if (!loginRes.ok || !loginRes.data.token) {
    console.log('\x1b[31mImpossible de continuer sans token valide. Assurez-vous que le serveur tourne (npm run dev).\x1b[0m');
    return;
  }
  token = loginRes.data.token;

  await runRequest(
    '1.2 Consultation du profil utilisateur (GET /profile)',
    `${BASE_URL}/api/auth/profile`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    },
    200
  );

  await runRequest(
    '1.3 Mise à jour du profil (PUT /profile)',
    `${BASE_URL}/api/auth/profile`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: 'Admin Khadija Validé' })
    },
    200
  );

  const testEmail = `tech_${Date.now()}@machinecare.com`;
  await runRequest(
    '1.4 Création d\'un nouveau compte (POST /register)',
    `${BASE_URL}/api/auth/register`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Technicien Test',
        email: testEmail,
        password: 'Password123!'
      })
    },
    201
  );

  // 2. Gestion des Machines
  console.log('\n\x1b[36m--- 2. Gestion du Parc de Machines ---\x1b[0m');

  const refTest = `MACH-${Date.now()}`;
  const machRes = await runRequest(
    '2.1 Création d\'une machine principale',
    `${BASE_URL}/api/machines`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reference: refTest,
        nom: 'Presse Hydraulique Test',
        atelier: 'Atelier A',
        localisation: 'Ligne 1',
        etat: 'disponible'
      })
    },
    201
  );

  if (machRes.ok && machRes.data.machine) {
    machineId = machRes.data.machine._id;
  }

  const machSansIncRes = await runRequest(
    '2.2 Création d\'une machine temporaire (pour test suppression)',
    `${BASE_URL}/api/machines`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reference: `DEL-${Date.now()}`,
        nom: 'Machine Vierge',
        atelier: 'Atelier B',
        etat: 'disponible'
      })
    },
    201
  );
  if (machSansIncRes.ok && machSansIncRes.data.machine) {
    machineSansIncidentId = machSansIncRes.data.machine._id;
  }

  await runRequest(
    '2.3 Règle unicité : Refus de référence dupliquée (409 Conflit)',
    `${BASE_URL}/api/machines`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reference: refTest,
        nom: 'Doublon Machine'
      })
    },
    409
  );

  await runRequest(
    '2.4 Liste des machines (GET /machines)',
    `${BASE_URL}/api/machines`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    },
    200
  );

  await runRequest(
    '2.5 Filtres par atelier et état (?atelier=Atelier A&etat=disponible)',
    `${BASE_URL}/api/machines?atelier=Atelier A&etat=disponible`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    },
    200
  );

  if (machineId) {
    await runRequest(
      '2.6 Détail d\'une machine par son ID',
      `${BASE_URL}/api/machines/${machineId}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      },
      200
    );

    await runRequest(
      '2.7 Modification de machine (PUT /machines/:id)',
      `${BASE_URL}/api/machines/${machineId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ etat: 'en maintenance' })
      },
      200
    );
  }

  // 3. Suivi des Incidents
  console.log('\n\x1b[36m--- 3. Suivi des Incidents & Maintenance ---\x1b[0m');

  if (machineId) {
    const incRes = await runRequest(
      '3.1 Déclaration d\'un incident sur la machine',
      `${BASE_URL}/api/incidents`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          machine: machineId,
          description: 'Surchauffe anormale du circuit hydraulique'
        })
      },
      201
    );

    if (incRes.ok && incRes.data.incident) {
      incidentId = incRes.data.incident._id;
    }

    await runRequest(
      '3.2 Consultation de tous les incidents',
      `${BASE_URL}/api/incidents`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      },
      200
    );

    await runRequest(
      '3.3 Filtre d\'incidents par statut (?statut=ouvert)',
      `${BASE_URL}/api/incidents?statut=ouvert`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      },
      200
    );

    await runRequest(
      '3.4 Historique des incidents par machine (/machines/:id/incidents)',
      `${BASE_URL}/api/machines/${machineId}/incidents`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      },
      200
    );

    if (incidentId) {
      await runRequest(
        '3.5 Règle stricte : Refus de résolution sans note (400)',
        `${BASE_URL}/api/incidents/${incidentId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ statut: 'resolu' })
        },
        400
      );

      await runRequest(
        '3.6 Résolution avec note obligatoire (200 avec resolvedAt)',
        `${BASE_URL}/api/incidents/${incidentId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            statut: 'resolu',
            resolutionNote: 'Capteur de température remplacé et test validé.'
          })
        },
        200
      );
    }

    // 4. Règles de suppression
    console.log('\n\x1b[36m--- 4. Règle de Suppression Sécurisée ---\x1b[0m');

    await runRequest(
      '4.1 Blocage de suppression d\'une machine ayant un incident (409)',
      `${BASE_URL}/api/machines/${machineId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      },
      409
    );
  }

  if (machineSansIncidentId) {
    await runRequest(
      '4.2 Suppression autorisée pour machine vierge (200)',
      `${BASE_URL}/api/machines/${machineSansIncidentId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      },
      200
    );
  }

  // 5. Erreurs globales
  console.log('\n\x1b[36m--- 5. Gestion Globale des Erreurs & Sécurité ---\x1b[0m');

  await runRequest(
    '5.1 Refus d\'accès sans token JWT (401 Non Autorisé)',
    `${BASE_URL}/api/machines`,
    { method: 'GET' },
    401
  );

  await runRequest(
    '5.2 Format d\'identifiant invalide CastError (404 Introuvable)',
    `${BASE_URL}/api/machines/id-inexistant-format-faux`,
    {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    },
    404
  );

  await runRequest(
    '5.3 Route inexistante (404 Not Found)',
    `${BASE_URL}/api/chemin-qui-n-existe-pas`,
    { method: 'GET' },
    404
  );

  console.log('\n========================================================');
  console.log(`RÉSULTAT FINAL : \x1b[32m${passedCount} Succès\x1b[0m | \x1b[31m${failedCount} Échecs\x1b[0m`);
  console.log('========================================================\n');
};

runAllTests();
