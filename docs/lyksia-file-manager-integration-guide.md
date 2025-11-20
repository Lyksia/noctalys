# Guide d'Intégration SDK Lyksia File Manager - Pour Agent IA

**Version du SDK :** 1.2.0  
**Package npm :** `@lyksia/file-manager`  
**Documentation complète :** https://backoffice.lyksia.com/docs

---

## Contexte du Projet

Le **Lyksia File Manager** est un système de gestion de fichiers SaaS avec :
- Un **backend API** (Hono + PostgreSQL + Prisma)
- Un **SDK JavaScript/TypeScript** pour les développeurs
- Un **back-office** Next.js pour l'administration

---

## Installation du SDK

```bash
npm install @lyksia/file-manager
```

**Prérequis :**
- Node.js 16+
- Une clé API obtenue depuis le dashboard

---

## Configuration de Base

### 1. Obtenir une Clé API

Se connecter au back-office : https://backoffice.lyksia.com  
Aller dans : Dashboard → API Keys → Créer une clé

### 2. Variables d'Environnement

```env
# .env
LYKSIA_API_KEY=votre-cle-api-64-caracteres
```

### 3. Initialisation du Client

```typescript
import { FileManagerClient } from '@lyksia/file-manager';

const client = new FileManagerClient({
  apiKey: process.env.LYKSIA_API_KEY!,
  devMode: false // true pour http://localhost:3001, false pour https://drive.lyksia.com
});
```

---

## API Complète du SDK

### Types Principaux

```typescript
interface FileManagerClient {
  files: FileManager;
  folders: FolderManager;
  apiKeys: ApiKeyManager;
}

interface FileManagerFile {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  hash: string;
  storagePath: string;
  width?: number;
  height?: number;
  thumbnailPath?: string;
  viewUrl: string;
  downloadUrl: string;
  thumbnailUrl?: string | null;
  tags: string[];
  description?: string;
  metadata?: Record<string, unknown>;
  isPublic: boolean;
  userId: string;
  folderId?: string;
  createdAt: string;
  updatedAt: string;
}

interface FileManagerFolder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface FileManagerApiKey {
  id: string;
  name: string;
  rateLimit: number;
  lastUsedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}
```

---

## Opérations sur les Fichiers

### Upload un ou plusieurs fichiers

```typescript
// Upload un seul fichier
const file: FileManagerFile = await client.files.upload({
  file: File,           // Objet File du navigateur ou Buffer en Node.js
  folderId?: string,    // ID du dossier parent (optionnel)
  tags?: string[],      // Tags pour catégoriser
  description?: string, // Description
  isPublic?: boolean    // true par défaut - URLs publiques permanentes
});

// Upload plusieurs fichiers
const files: FileManagerFile[] = await client.files.upload({
  file: File[],         // Tableau de fichiers
  folderId?: string,    // Tous les fichiers vont dans le même dossier
  tags?: string[],      // Tags appliqués à tous les fichiers
  description?: string, // Description appliquée à tous les fichiers
  isPublic?: boolean    // true par défaut - URLs publiques permanentes
});
```

**Exemple - Upload simple :**
```typescript
const file = await client.files.upload({
  file: myFile,
  tags: ['invoice', '2025'],
  description: 'Facture client ABC',
  folderId: 'folder-id-123'
});

console.log(file.id);           // ID unique du fichier
console.log(file.downloadUrl);  // URL de téléchargement
```

**Exemple - Upload multiple :**
```typescript
const uploadedFiles = await client.files.upload({
  file: [file1, file2, file3],
  tags: ['batch', '2025'],
  folderId: 'folder-id-123'
});

uploadedFiles.forEach(file => {
  console.log(`✅ ${file.name} - ${file.downloadUrl}`);
});
```

**Note importante :** Le type de retour dépend du paramètre d'entrée :
- Si `file` est un `File` → retourne `FileManagerFile`
- Si `file` est un `File[]` → retourne `FileManagerFile[]`

### Lister les fichiers

```typescript
const response = await client.files.list({
  page?: number,      // Page (défaut: 1)
  limit?: number,     // Limite (défaut: 20)
  search?: string,    // Recherche par nom
  folderId?: string,  // Filtrer par dossier
  tags?: string[]     // Filtrer par tags
});

// response.data = FileManagerFile[]
// response.pagination = { page, limit, total, totalPages }
```

**Exemple :**
```typescript
const { data: files, pagination } = await client.files.list({
  page: 1,
  limit: 50,
  search: 'invoice',
  tags: ['2025']
});

files.forEach(file => {
  console.log(`${file.name} - ${file.size} bytes`);
});
```

### Récupérer un fichier

```typescript
const file: FileManagerFile = await client.files.get(fileId);
```

### Mettre à jour un fichier

```typescript
const updatedFile = await client.files.update(fileId, {
  name?: string,
  tags?: string[],
  description?: string,
  folderId?: string
});
```

**Exemple :**
```typescript
await client.files.update('file-id-123', {
  name: 'nouveau-nom.pdf',
  tags: ['archived', '2024'],
  folderId: 'autre-dossier-id'
});
```

### Supprimer un fichier

```typescript
await client.files.delete(fileId);
```

### Télécharger un fichier

```typescript
const blob: Blob = await client.files.download(fileId);

// En Node.js, convertir en Buffer
const buffer = Buffer.from(await blob.arrayBuffer());
```

### Obtenir l'URL d'un fichier

```typescript
const downloadUrl = client.files.getFileUrl(fileId);
const thumbnailUrl = client.files.getThumbnailUrl(fileId);
```

**URLs publiques permanentes (depuis v1.2.0) :**

Les fichiers publics (`isPublic: true`, par défaut) génèrent des URLs permanentes sans authentification :

```typescript
const file = await client.files.upload({ file: myFile });

// URLs publiques - peuvent être stockées en base de données
console.log(file.viewUrl);
// → https://drive.lyksia.com/api/public/files/{id}/view

console.log(file.downloadUrl);
// → https://drive.lyksia.com/api/public/files/{id}/download

// Utilisable directement dans des lecteurs HTML5
<audio controls src={file.viewUrl} />
<video controls src={file.viewUrl} />
<img src={file.viewUrl} alt="Image" />
```

**Fichiers privés :**

```typescript
const privateFile = await client.files.upload({ 
  file: secretDoc,
  isPublic: false  // URL retournera 403 Forbidden
});
```

---

## Opérations sur les Dossiers

### Créer un dossier

```typescript
const folder: FileManagerFolder = await client.folders.create({
  name: string,
  description?: string,
  parentId?: string
});
```

**Exemple :**
```typescript
const folder = await client.folders.create({
  name: 'Documents 2025',
  description: 'Tous les documents de 2025',
  parentId: 'dossier-parent-id' // ou undefined pour racine
});
```

### Lister les dossiers

```typescript
const folders = await client.folders.list({
  parentId?: string  // Filtrer par dossier parent
});
```

### Récupérer l'arborescence complète

```typescript
const tree = await client.folders.tree();
// Retourne la structure hiérarchique complète
```

### Récupérer un dossier

```typescript
const folder: FileManagerFolder = await client.folders.get(folderId);
```

### Mettre à jour un dossier

```typescript
const updatedFolder = await client.folders.update(folderId, {
  name?: string,
  description?: string,
  parentId?: string
});
```

### Supprimer un dossier

```typescript
await client.folders.delete(folderId);
// ⚠️ Supprime aussi tous les fichiers et sous-dossiers
```

---

## Opérations sur les API Keys

### Créer une API Key

```typescript
const { apiKey, record } = await client.apiKeys.create({
  name: string,
  rateLimit?: number,
  expiresAt?: Date
});

// apiKey = clé en clair (à sauvegarder, ne sera plus visible)
// record = objet FileManagerApiKey avec métadonnées
```

**Exemple :**
```typescript
const { apiKey, record } = await client.apiKeys.create({
  name: 'Production Key',
  rateLimit: 10000,
  expiresAt: new Date('2026-12-31')
});

console.log('🔑 Sauvegardez cette clé:', apiKey);
console.log('ID:', record.id);
```

### Lister les API Keys

```typescript
const apiKeys = await client.apiKeys.list();
```

### Supprimer une API Key

```typescript
await client.apiKeys.delete(apiKeyId);
```

---

## Utilitaires

### Formater la taille d'un fichier

```typescript
import { formatFileSize } from '@lyksia/file-manager';

formatFileSize(1024);       // "1 KB"
formatFileSize(1048576);    // "1 MB"
formatFileSize(1073741824); // "1 GB"
```

### Obtenir l'extension d'un fichier

```typescript
import { getFileExtension } from '@lyksia/file-manager';

getFileExtension('document.pdf');        // "pdf"
getFileExtension('image.png');           // "png"
getFileExtension('archive.tar.gz');      // "gz"
```

### Vérifier le type de fichier

```typescript
import { isImageFile, isVideoFile, isDocumentFile } from '@lyksia/file-manager';

isImageFile('image/png');                    // true
isImageFile('application/pdf');              // false

isVideoFile('video/mp4');                    // true
isVideoFile('image/jpeg');                   // false

isDocumentFile('application/pdf');           // true
isDocumentFile('application/vnd.ms-excel');  // true
isDocumentFile('image/png');                 // false
```

---

## Gestion des Erreurs

Toutes les méthodes du SDK peuvent lever des exceptions. Utiliser `try/catch` :

```typescript
try {
  const file = await client.files.upload({ file: myFile });
  console.log('✅ Fichier uploadé:', file.id);
} catch (error) {
  if (error.response?.status === 401) {
    console.error('❌ Clé API invalide');
  } else if (error.response?.status === 413) {
    console.error('❌ Fichier trop volumineux');
  } else if (error.response?.status === 429) {
    console.error('❌ Rate limit dépassé');
  } else {
    console.error('❌ Erreur:', error.message);
  }
}
```

**Codes d'erreur courants :**
- `400` - Requête invalide
- `401` - Non autorisé (clé API invalide)
- `403` - Accès refusé
- `404` - Ressource non trouvée
- `413` - Fichier trop volumineux
- `429` - Trop de requêtes (rate limiting)
- `500` - Erreur serveur

---

## Exemples Complets

### Exemple 1 : Upload et Organisation (Méthode Optimisée)

```typescript
import { FileManagerClient } from '@lyksia/file-manager';

const client = new FileManagerClient({
  apiKey: process.env.LYKSIA_API_KEY!
});

async function organizeInvoices(files: File[]) {
  // 1. Créer un dossier pour les factures
  const invoiceFolder = await client.folders.create({
    name: 'Factures 2025',
    description: 'Toutes les factures de l\'année 2025'
  });

  // 2. Uploader tous les fichiers en une seule requête (nouveau en v1.1.0)
  const uploadedFiles = await client.files.upload({
    file: files,
    folderId: invoiceFolder.id,
    tags: ['invoice', '2025'],
    description: 'Factures 2025'
  });

  uploadedFiles.forEach(uploaded => {
    console.log(`✅ ${uploaded.name} uploadé`);
  });

  // 3. Lister tous les fichiers du dossier
  const { data: allInvoices } = await client.files.list({
    folderId: invoiceFolder.id
  });

  console.log(`📊 Total factures: ${allInvoices.length}`);
}
```

**Alternative - Upload fichier par fichier (pour descriptions personnalisées) :**

```typescript
async function organizeInvoicesWithCustomDescriptions(files: File[]) {
  const invoiceFolder = await client.folders.create({
    name: 'Factures 2025',
    description: 'Toutes les factures de l\'année 2025'
  });

  for (const file of files) {
    const uploaded = await client.files.upload({
      file,
      folderId: invoiceFolder.id,
      tags: ['invoice', '2025'],
      description: `Facture ${file.name}`
    });
    
    console.log(`✅ ${uploaded.name} uploadé`);
  }
}
```

### Exemple 2 : Migration de Fichiers

```typescript
async function migrateBetweenFolders(sourceId: string, targetId: string) {
  // 1. Récupérer tous les fichiers du dossier source
  const { data: files } = await client.files.list({
    folderId: sourceId,
    limit: 1000
  });

  console.log(`📦 ${files.length} fichiers à migrer`);

  // 2. Déplacer chaque fichier vers le dossier cible
  for (const file of files) {
    await client.files.update(file.id, {
      folderId: targetId
    });
    console.log(`✅ ${file.name} déplacé`);
  }

  console.log('🎉 Migration terminée');
}
```

### Exemple 3 : Recherche et Téléchargement

```typescript
async function downloadInvoicesByDate(year: number) {
  // 1. Rechercher toutes les factures de l'année
  const { data: files } = await client.files.list({
    tags: ['invoice', year.toString()],
    limit: 1000
  });

  console.log(`📄 ${files.length} factures trouvées pour ${year}`);

  // 2. Télécharger chaque fichier
  for (const file of files) {
    const blob = await client.files.download(file.id);
    const buffer = Buffer.from(await blob.arrayBuffer());
    
    // Sauvegarder localement
    const fs = require('fs');
    fs.writeFileSync(`./downloads/${file.name}`, buffer);
    
    console.log(`⬇️ ${file.name} téléchargé`);
  }
}
```

### Exemple 4 : Nettoyage Automatique

```typescript
import { formatFileSize } from '@lyksia/file-manager';

async function cleanupOldFiles(daysOld: number) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  // 1. Récupérer tous les fichiers
  const { data: files } = await client.files.list({ limit: 1000 });

  let deletedCount = 0;
  let freedSpace = 0;

  // 2. Supprimer les fichiers trop anciens
  for (const file of files) {
    const fileDate = new Date(file.createdAt);
    
    if (fileDate < cutoffDate) {
      await client.files.delete(file.id);
      deletedCount++;
      freedSpace += file.size;
      
      console.log(`🗑️ Supprimé: ${file.name}`);
    }
  }

  console.log(`✅ ${deletedCount} fichiers supprimés`);
  console.log(`💾 Espace libéré: ${formatFileSize(freedSpace)}`);
}
```

---

## Best Practices

### 1. **Sécurité**
- ✅ Ne jamais exposer la clé API côté client
- ✅ Utiliser des variables d'environnement
- ✅ Renouveler régulièrement les clés API
- ✅ Utiliser des clés différentes par environnement (dev/staging/prod)

### 2. **Performance**
- ✅ Utiliser la pagination pour les grandes listes
- ✅ Filtrer par tags ou dossier plutôt que tout charger
- ✅ Mettre en cache les résultats fréquemment utilisés
- ✅ Upload en batch pour plusieurs fichiers

### 3. **Organisation**
- ✅ Créer une hiérarchie de dossiers logique
- ✅ Utiliser des tags cohérents (minuscules, sans espaces)
- ✅ Ajouter des descriptions aux fichiers importants
- ✅ Préfixer les noms de fichiers par date si pertinent (2025-01-15-invoice.pdf)

### 4. **Gestion d'Erreurs**
- ✅ Toujours wrapper les appels dans try/catch
- ✅ Logger les erreurs pour debug
- ✅ Gérer spécifiquement les erreurs 429 (rate limit)
- ✅ Implémenter des retries avec backoff exponentiel

---

## Limites et Quotas

**Rate Limiting :**
- Défini par API Key (par défaut: 1000 requêtes/heure)
- Header `X-RateLimit-Remaining` dans les réponses
- Code 429 si limite dépassée

**Taille des fichiers :**
- Maximum par fichier : à vérifier avec l'admin
- Pas de limite sur le nombre total de fichiers

**Déduplication :**
- Les fichiers identiques (même hash SHA-256) sont automatiquement dédupliqués
- L'espace de stockage est optimisé

---

## Migration depuis v0.7.0

Si tu utilises une ancienne version du SDK :

```typescript
// ❌ Ancien (v0.7.0)
import { LyksiaUpload, LyksiaFile } from '@lyksia/file-manager';
const upload = new LyksiaUpload({ apiKey: '...' });

// ✅ Nouveau (v1.0.0)
import { FileManagerClient, FileManagerFile } from '@lyksia/file-manager';
const client = new FileManagerClient({ apiKey: '...' });
```

Voir le guide complet : `/docs/sdk-migration-plan.md`

---

## Ressources

- **Documentation interactive :** https://backoffice.lyksia.com/docs
- **Référence API complète :** https://backoffice.lyksia.com/docs/api
- **Guide d'installation :** https://backoffice.lyksia.com/docs/installation
- **Exemples d'utilisation :** https://backoffice.lyksia.com/docs/usage
- **Migration v1.0.0 :** `/docs/sdk-migration-plan.md`
- **README du package :** `/package/README.md`

---

## Support

Pour toute question ou problème :
- Consulter d'abord la documentation interactive
- Vérifier les exemples de code
- Contacter le support si nécessaire

---

**Version du document :** 1.2  
**Dernière mise à jour :** 2025-11-20  
**Compatible avec :** @lyksia/file-manager@1.2.0

---

## Nouveautés

### v1.2.0 - URLs Publiques Permanentes

**URLs sans authentification JWT :**

Les fichiers génèrent maintenant des URLs publiques permanentes, sans token JWT expirant :

```typescript
const file = await client.files.upload({ file: audioFile });

// URLs permanentes - stockables en base de données
console.log(file.viewUrl);
// → https://drive.lyksia.com/api/public/files/{id}/view (sans ?token=xxx)

// Fonctionne dans les lecteurs HTML5
<audio controls src={file.viewUrl}>Your browser does not support audio</audio>
<video controls src={file.viewUrl}>Your browser does not support video</video>
```

**Paramètre `isPublic` :**

Contrôlez la visibilité des fichiers :

```typescript
// Public (défaut) - URL accessible sans authentification
const publicFile = await client.files.upload({ 
  file: myFile,
  isPublic: true  // optionnel, true par défaut
});

// Privé - URL retournera 403 Forbidden
const privateFile = await client.files.upload({ 
  file: secretDoc,
  isPublic: false
});

// Changer la visibilité
await client.files.update(fileId, { isPublic: false });
```

**Avantages :**
- ✅ URLs permanentes et partageables
- ✅ Stockables en base de données
- ✅ Compatibles avec lecteurs audio/vidéo HTML5
- ✅ Support du streaming (Accept-Ranges header)
- ✅ CORS activé pour usage externe
- ✅ Cache optimisé (1 an pour fichiers immutables)

**Breaking Change :**
- URLs changées de `/api/files/:id/view?token=xxx` vers `/api/public/files/:id/view`
- Les anciennes URLs avec token JWT continuent de fonctionner mais sont dépréciées

### v1.1.0 - Upload Multiple de Fichiers

La version 1.1.0 introduit le support natif de l'upload multiple :

```typescript
// Avant (v1.0.0) - nécessitait une boucle
for (const file of files) {
  await client.files.upload({ file });
}

// Maintenant (v1.1.0) - upload en batch
const uploadedFiles = await client.files.upload({ 
  file: files 
});
```

**Avantages :**
- ✅ Code plus simple et concis
- ✅ Meilleure performance (une seule requête HTTP)
- ✅ Type de retour adaptatif (File → FileManagerFile, File[] → FileManagerFile[])
- ✅ Même API pour single et multiple uploads

### Types de Fichiers Supportés

Le backend supporte une large gamme de formats :

**Images :** JPEG, PNG, WebP, GIF, SVG  
**Documents :** PDF, DOC/DOCX, XLS/XLSX, PPT/PPTX, TXT, CSV  
**Archives :** ZIP, RAR, 7Z, GZIP  
**Audio :** MP3, WAV, OGG, AAC, FLAC, WebM  
**Vidéo :** MP4, WebM, OGG, QuickTime, AVI
