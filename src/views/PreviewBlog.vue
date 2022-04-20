
<template>
    <div class="blog-wrapper">
        <img :src="form.coverImage" alt="">
        <h1>{{form.postTitle}}</h1>
        <div class="post-content ql-editor" v-html="form.editorContent"></div>
        
    </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import '@vueup/vue-quill/dist/vue-quill.snow.css';

let form = reactive({
    postTitle: localStorage.getItem("current-blog-title") ?? null,
    editorContent: localStorage.getItem("current-blog-editorContent") ?? null,
    coverImage: localStorage.getItem("current-blog-cover-image") ?? null
});

</script>

<style>
.quillWrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
}
.ql-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: auto;
}
.ql-editor {
    padding: 20px 16px 30px;
}
pre.ql-syntax {
    background-color: #23241f;
    color: #f8f8f2;
    overflow: visible;
    padding: 1rem;
}

pre {
    white-space: pre-wrap;
    margin-bottom: 5px;
    margin-top: 5px;
    padding: 5px 10px;
}
.ql-editor .ql-video {
    display: block;
    margin: auto;
    /* max-width: 700px; */
}
iframe.ql-video {
    min-height: 300px;
    min-width: 500px;
    width: 100%;
}

</style>