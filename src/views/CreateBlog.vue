<template>
    <div>
        <div class="create-post">
            <div class="main-con">
                <div class="blog-info">
                    <input
                        type="text"
                        class="post-name input"
                        placeholder="Enter Blog title..."
                        v-model="form.postTitle"
                        @input="savePostTitle"
                    />
                    <div class="cover-pic">
                        <label for="blog-pic">Upload Cover Photo</label>
                        <input
                            type="file"
                            id="blog-pic"
                            accept=".png, .jpg, .jpeg"
                            v-on:change="form.coverImage = $event"
                        />
                        {{ coverPhotoFileName }}
                        <button
                            class="preview-pic-btn"
                            :disabled="!coverPhotoFileName"
                        >Preview photo</button>
                    </div>
                </div>
                <div class="editor-con">
                    <QuillEditor
                        theme="snow"
                        toolbar="full"
                        v-model:content="form.editorContent"
                        content-type="html"
                        @update:content="savePostEditorContent($event)"
                        :options="options"
                    />
                </div>

                <div class="blog-actions">
                    <div class="tag-title">Tags</div>
                    <div class="tag-list">
                        <div class="tag-item" v-for="(tag, idx) in form.tags" :key="idx">
                            <span @click="removeTag(idx)">{{ tag }}</span>
                        </div>
                    </div>
                    <form @submit.prevent="handleAddTag">
                        <input type="text" class="input" v-model="tag" />
                        <button class="btn">add tag</button>
                    </form>
                    <div class="btn-wrapper">
                        <button class="btn" @click="previewPost">Preview</button>
                        <button class="btn" v-if="!editMode" @click="publishPost">Publish</button>
                        <button class="btn" v-if="editMode" @click="updatePost">Update Post</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Graph from "../libs/avanda.ts"
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { reactive, ref } from '@vue/reactivity';
import { createToast, withProps } from "mosha-vue-toastify";
import "mosha-vue-toastify/dist/style.css";
import ToastText from "../components/toast-text.vue";
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from "@vue/runtime-core";
const router = useRouter()
const route = useRoute()

let form = reactive({
    postTitle: localStorage.getItem("current-blog-title") ?? null,
    editorContent: localStorage.getItem("current-blog-editorContent") ?? null,
    coverImage: null,
    tags: [],

});
let coverPhotoFileName = ref(null);
let error = ref(null);
let editorSettings = reactive({



});

let tag = ref(null);
let editMode = ref(false);
coverPhotoFileName.value = localStorage.getItem("current-blog-cover-image-name") ?? null;
let options = {
    placeholder: 'Compose Your Epic Blog...',
    theme: 'snow'
}
function savePostEditorContent(e) {
    localStorage.setItem("current-blog-editorContent", form.editorContent);

}
function savePostTitle() {
    localStorage.setItem("current-blog-title", form.postTitle);
}
function getChosenCoverImage(e) {
    let file = e.target.files[0];
    coverPhotoFileName.value = file.name;
    form.coverImage = e;
    let reader = new FileReader();
    reader.onload = function (e) {
        localStorage.setItem("current-blog-cover-image", form.coverImage);
        localStorage.setItem("current-blog-cover-image-name", file.name);
    }
    console.log(reader.readAsDataURL(file))
}
function handleAddTag() {
    if (tag.value) {
        form.tags.push(tag.value);
        tag.value = null;
    }
}
function removeTag(idx) {
    form.tags.splice(idx, 1);
}
function previewPost(e) {
    location.href = "/post/preview";
}
async function publishPost() {
    try {
        if (form.coverImage && form.editorContent && form.postTitle && form.tags.length > 0) {
            console.log("Publishing")
            console.log(form)
            let req = new Graph().service('Blog/createPost')
            let data = await (await req.post(form)).getData()
            console.log(data)
            if (data) {
                localStorage.removeItem("current-blog-title");
                localStorage.removeItem("current-blog-editorContent");
                localStorage.removeItem("current-blog-cover-image");
                localStorage.removeItem("current-blog-cover-image-name");
                createToast(withProps(ToastText, { text: "Post published" }), {
                    showIcon: "true",
                    swipeClose: "true",
                    type: "success",
                    transition: "bounce",
                    position: "bottom-center"
                })
            }
        }
        else {
            createToast(withProps(ToastText, { text: "Upload a cover image and add tags and check all fields" }), {
                showIcon: "true",
                swipeClose: "true",
                type: "danger",
                transition: "bounce",
                position: "bottom-center"
            })
        }

    } catch (error) {
        console.log(error)
        if (error.getMsg()) {
            createToast(withProps(ToastText, { text: error.getMsg() ?? "Error in Post check your network" }), {
                showIcon: "true",
                swipeClose: "true",
                type: "danger",
                transition: "bounce",
                position: "bottom-center"
            })
        }
    }

}
function changeToEditMode() {
    editMode.value = true;
}
async function isPostValid() {
    try {
        let req = new Graph().service('Blog/checkIfEditablePostIsValid')
        if (route.query.edit) {
            let data = await (await req.post({
                postId: route.query.edit.slice(2),
                id: route.query.edit.slice(0, 1)
            })).getData()
            console.log(data)
            if (data) {
                changeToEditMode()
                // form = reactive({
                //     postTitle: data ?? null,
                //     editorContent: localStorage.getItem("current-blog-editorContent") ?? null,
                //     coverImage: null,
                //     tags: [],

                // });
                form.postTitle = data.title;
                form.editorContent = data.content;
                form.tags = data.tags;
                form.coverImage = data.coverImage;

            }
        }



    } catch (error) {
        // if (error.getMsg()) {
        //     createToast(withProps(ToastText, { text: error.getMsg() ?? "Error in Post check your network" }), {
        //         showIcon: "true",
        //         swipeClose: "true",
        //         type: "danger",
        //         transition: "bounce",
        //         position: "bottom-center"
        //     })
        // }
        console.log(error)
    }
}
onMounted(() => {
    console.log(route.query)
    if (route.query.edit) {
        console.log("wrtfnnv")
        changeToEditMode()
        isPostValid()
    }
})
</script>

<style>
.main-con {
    width: 80%;
    height: 100%;
    margin: 0 auto;
}
.btn {
    margin-top: 30px;
}
.editor-con {
    margin-top: 2rem;
    margin-bottom: 2rem;
}
.editor-con {
    height: 80vh;
    display: flex;
    flex-direction: column;
}
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
.tag-list {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    grid-gap: 10px;
    flex-wrap: wrap;
}
.tag-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    background-color: #23241f;
    color: #f8f8f2;
    cursor: pointer;
}
</style>