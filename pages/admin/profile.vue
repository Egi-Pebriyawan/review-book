<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Edit Profil</h1>
      <p class="text-gray-600 mt-1">Ubah informasi profil Anda</p>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="animate-pulse space-y-6">
      <div class="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
        <div class="h-10 bg-gray-200 rounded w-1/2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/4"></div>
        <div class="h-32 bg-gray-200 rounded w-full"></div>
      </div>
    </div>

    <!-- Profile Form -->
    <form v-else-if="profile" @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Basic Info -->
      <div class="bg-white rounded-xl shadow-sm border p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Informasi Dasar</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama <span class="text-red-500">*</span></label>
            <input v-model="form.name" type="text" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Foto Profil (Avatar)</label>

            <!-- Avatar Preview -->
            <div class="flex items-center gap-4 mb-3">
              <img v-if="avatarPreview || form.avatar_url" :src="avatarPreview || form.avatar_url" alt="Avatar preview" class="w-24 h-24 rounded-full object-cover border-2 border-gray-200" />
              <div v-else class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                {{ (form.name || "A").charAt(0).toUpperCase() }}
              </div>
            </div>

            <!-- Upload Button -->
            <div class="flex items-center gap-3">
              <label class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors text-sm font-medium">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Pilih File
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" @change="handleFileUpload" class="hidden" />
              </label>
              <button v-if="avatarFile" type="button" @click="removeAvatar" class="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium">Hapus</button>
            </div>

            <!-- Upload Status -->
            <p v-if="uploadingAvatar" class="text-sm text-blue-600 mt-1 flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Mengupload...
            </p>
            <p class="text-xs text-gray-500 mt-1">Format: JPG, PNG, WebP, atau GIF. Maksimal 2MB.</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
            <input v-model="form.location" type="text" placeholder="Jakarta, Indonesia" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea v-model="form.bio" rows="4" placeholder="Ceritakan tentang diri Anda..." class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
        </div>
      </div>

      <!-- Reading Goals -->
      <div class="bg-white rounded-xl shadow-sm border p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Target Baca</h2>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Target Tahunan (jumlah buku)</label>
          <input v-model.number="form.yearly_target" type="number" min="1" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <!-- Social Links -->
      <div class="bg-white rounded-xl shadow-sm border p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Media Sosial</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                  />
                </svg>
                Instagram URL
              </span>
            </label>
            <input v-model="form.instagram" type="url" placeholder="https://instagram.com/username" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                  />
                </svg>
                Twitter URL
              </span>
            </label>
            <input v-model="form.twitter" type="url" placeholder="https://twitter.com/username" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
                  />
                </svg>
                TikTok URL
              </span>
            </label>
            <input v-model="form.tiktok" type="url" placeholder="https://tiktok.com/@username" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M11.43 23.995c-3.586-.196-6.296-2.078-7.14-5.196-.27-1.012-.362-2.14-.46-4.653-.098-2.509-.192-3.643-.459-4.65-.99-3.664-3.63-5.613-7.23-5.363l-.531.037V.165h.531c3.6.25 6.24-1.7 7.23-5.363.267-1.007.36-2.141.459-4.65.098-2.513.19-3.642.46-4.653.844-3.118 3.554-5 7.14-5.196.36-.02.74-.02 1.1 0 3.586.196 6.296 2.078 7.14 5.196.27 1.012.362 2.14.46 4.653.098 2.509.192 3.643.459 4.65.99 3.664 3.63 5.613 7.23 5.363l.531-.037v3.997h-.531c-3.6-.25-6.24 1.7-7.23 5.363-.267 1.007-.36 2.141-.459 4.65-.098 2.513-.19 3.642-.46 4.653-.844 3.118-3.554 5-7.14 5.196-.36.02-.74.02-1.1 0z"
                  />
                </svg>
                Goodreads URL
              </span>
            </label>
            <input v-model="form.goodreads" type="url" placeholder="https://goodreads.com/user" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <!-- Donation Links -->
      <div class="bg-white rounded-xl shadow-sm border p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Link Donasi</h2>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Saweria URL</label>
            <input v-model="form.saweria_url" type="url" placeholder="https://saweria.co/username" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Trakteer URL</label>
            <input v-model="form.trakteer_url" type="url" placeholder="https://trakteer.id/username" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex gap-3">
        <button type="submit" :disabled="submitting" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">
          {{ submitting ? "Menyimpan..." : "Simpan Perubahan" }}
        </button>
        <button type="button" @click="resetForm" class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">Reset</button>
      </div>

      <p v-if="successMessage" class="text-green-700">{{ successMessage }}</p>
      <p v-if="errorMessage" class="text-red-700">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

useSeoMeta({
  title: "Edit Profil — Admin Panel",
});

const supabase = useSupabaseClient();

// Avatar upload state
const avatarFile = ref<File | null>(null);
const avatarPreview = ref<string | null>(null);
const uploadingAvatar = ref(false);

// Fetch profile
const {
  data: profile,
  pending,
  refresh: refreshProfile,
} = await useAsyncData("admin-profile", async () => {
  const { data } = await supabase.from("profile").select("*").single();
  return data;
});

// Form state
const submitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const form = ref({
  name: "",
  bio: "",
  avatar_url: "",
  location: "",
  instagram: "",
  twitter: "",
  tiktok: "",
  goodreads: "",
  saweria_url: "",
  trakteer_url: "",
  yearly_target: 24,
});

// Initialize form with profile data
watch(
  profile,
  (newProfile) => {
    if (newProfile) {
      form.value = {
        name: newProfile.name || "",
        bio: newProfile.bio || "",
        avatar_url: newProfile.avatar_url || "",
        location: newProfile.location || "",
        instagram: newProfile.instagram || "",
        twitter: newProfile.twitter || "",
        tiktok: newProfile.tiktok || "",
        goodreads: newProfile.goodreads || "",
        saweria_url: newProfile.saweria_url || "",
        trakteer_url: newProfile.trakteer_url || "",
        yearly_target: newProfile.yearly_target || 24,
      };
    }
  },
  { immediate: true },
);

// Handle file upload
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    alert("Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.");
    input.value = "";
    return;
  }

  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    alert("Ukuran file terlalu besar. Maksimal 2MB.");
    input.value = "";
    return;
  }

  avatarFile.value = file;

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    avatarPreview.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

// Remove avatar
const removeAvatar = () => {
  avatarFile.value = null;
  avatarPreview.value = null;
  form.value.avatar_url = "";
};

// Upload avatar to Supabase Storage
const uploadAvatar = async (userId: string): Promise<string | null> => {
  if (!avatarFile.value) return form.value.avatar_url || null;

  uploadingAvatar.value = true;

  try {
    // Generate unique filename
    const fileExt = avatarFile.value.name.split(".").pop();
    const fileName = `avatar-${userId}-${Date.now()}.${fileExt}`;
    const filePath = `profiles/${fileName}`;

    // Upload to Supabase Storage bucket 'avatars'
    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, avatarFile.value, {
      cacheControl: "3600",
      upsert: true,
    });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

    return data.publicUrl;
  } catch (e: any) {
    console.error("Upload error:", e);
    alert("Gagal mengupload avatar: " + (e.message || "Unknown error"));
    return null;
  } finally {
    uploadingAvatar.value = false;
  }
};

// Submit form
const handleSubmit = async () => {
  submitting.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    // Upload avatar if there's a new file
    let avatarUrl = form.value.avatar_url;
    if (avatarFile.value) {
      const uploadedUrl = await uploadAvatar(profile.value.id);
      if (uploadedUrl) {
        avatarUrl = uploadedUrl;
      }
    }

    const { error } = await supabase
      .from("profile")
      .update({
        ...form.value,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.value.id);

    if (error) throw error;

    successMessage.value = "✅ Profil berhasil diperbarui!";
    await refreshProfile();

    // Reset upload state
    avatarFile.value = null;
    avatarPreview.value = null;
  } catch (e: any) {
    errorMessage.value = "❌ Gagal memperbarui profil: " + (e.message || "Unknown error");
  } finally {
    submitting.value = false;
  }
};

// Reset form
const resetForm = () => {
  if (profile.value) {
    form.value = {
      name: profile.value.name || "",
      bio: profile.value.bio || "",
      avatar_url: profile.value.avatar_url || "",
      location: profile.value.location || "",
      instagram: profile.value.instagram || "",
      twitter: profile.value.twitter || "",
      tiktok: profile.value.tiktok || "",
      goodreads: profile.value.goodreads || "",
      saweria_url: profile.value.saweria_url || "",
      trakteer_url: profile.value.trakteer_url || "",
      yearly_target: profile.value.yearly_target || 24,
    };
    successMessage.value = "";
    errorMessage.value = "";
  }
};
</script>
