<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Moderasi Komentar</h1>
      <p class="text-gray-600 mt-1">Kelola komentar yang menunggu persetujuan</p>
    </div>

    <!-- Stats -->
    <div v-if="pendingComments.length > 0" class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
      <div class="flex items-center gap-3">
        <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <span class="text-yellow-800 font-medium">Ada {{ pendingComments.length }} komentar menunggu persetujuan</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse bg-white rounded-xl shadow-sm border p-6">
        <div class="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
        <div class="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="pendingComments.length === 0" class="bg-white rounded-xl shadow-sm border p-12 text-center">
      <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Komentar Pending</h3>
      <p class="text-gray-600">Semua komentar sudah dimoderasi</p>
    </div>

    <!-- Comments List -->
    <div v-else class="space-y-4">
      <div
        v-for="comment in pendingComments"
        :key="comment.id"
        class="bg-white rounded-xl shadow-sm border p-6"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <span class="font-semibold text-gray-900">{{ comment.name }}</span>
              <span class="text-xs text-gray-500">{{ formatDate(comment.created_at) }}</span>
            </div>
            <div v-if="comment.email" class="text-sm text-gray-600 mb-2">
              📧 {{ comment.email }}
            </div>
            <div class="text-sm text-blue-600 mb-2">
              📖 Untuk buku: <strong>{{ comment.books?.title || 'Unknown' }}</strong>
              <NuxtLink :to="`/books/${comment.books?.slug}`" target="_blank" class="ml-1 text-blue-700 hover:underline">
                (lihat)
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <p class="text-gray-700 whitespace-pre-line">{{ comment.content }}</p>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap gap-2">
          <button
            @click="approveComment(comment.id)"
            :disabled="processingId === comment.id"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <svg v-if="processingId === comment.id" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            Approve
          </button>

          <button
            @click="markSpam(comment.id)"
            :disabled="processingId === comment.id"
            class="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <svg v-if="processingId === comment.id" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            Mark Spam
          </button>

          <button
            @click="deleteCommentConfirm(comment.id)"
            :disabled="processingId === comment.id"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <svg v-if="processingId === comment.id" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
});

useSeoMeta({
  title: 'Moderasi Komentar — Admin Panel'
});

const { getPendingComments, approveComment: approve, markAsSpam, deleteComment } = useComments();

const { data: pendingComments, pending, refresh } = await useAsyncData('pending-comments', async () => {
  const comments = await getPendingComments();
  return comments;
});

const processingId = ref<string | null>(null);

// Approve comment
const approveComment = async (id: string) => {
  processingId.value = id;
  try {
    await approve(id);
    // Remove from list immediately
    pendingComments.value = pendingComments.value.filter(c => c.id !== id);
  } catch (e: any) {
    alert('Gagal approve komentar: ' + e.message);
  } finally {
    processingId.value = null;
  }
};

// Mark as spam
const markSpam = async (id: string) => {
  processingId.value = id;
  try {
    await markAsSpam(id);
    pendingComments.value = pendingComments.value.filter(c => c.id !== id);
  } catch (e: any) {
    alert('Gagal mark spam: ' + e.message);
  } finally {
    processingId.value = null;
  }
};

// Delete comment with confirmation
const deleteCommentConfirm = async (id: string) => {
  if (!confirm('Yakin ingin menghapus komentar ini? Tindakan ini tidak bisa dibatalkan.')) {
    return;
  }

  processingId.value = id;
  try {
    await deleteComment(id);
    pendingComments.value = pendingComments.value.filter(c => c.id !== id);
  } catch (e: any) {
    alert('Gagal menghapus komentar: ' + e.message);
  } finally {
    processingId.value = null;
  }
};

// Format date
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>
