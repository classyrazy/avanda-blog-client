<template>
  <div class="container">
    <div class="header">
      <div class="nav-links">
        <a href="/" class="nav-link">Avanda blog</a>
      <div class="auth-links">
        <router-link to="/login" class="nav-link">login</router-link>
        <router-link to="/signup" class="nav-link">Signup</router-link>
        
      </div>
        <router-link to="/post/create" class="nav-link">Create Post</router-link>

      </div>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style>
*{
  margin: 0;
  padding: 0;
  transition: all 0.5s ease;
}
.container{
  background: #ccc;
  width: 100%;
  height: 100%;
}
.nav-links{
 display: flex;
  align-items: center;
  justify-content: center;
}
.nav-link{
  color: #000;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 1rem;
  
}
.input {
    width: 100%;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 0 10px;
}
.btn {
    width: 100%;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 0 10px;
    max-width: 200px;
    cursor: pointer;
}
.btn-wrapper {
    display: flex;
    justify-content: space-between;
}
.error-text {
    color: red;
    font-size: 12px;
    margin-top: 5px;
}

</style>