<template>
    <div id="app">
        {{msg}}
    </div>
</template>

<script>
export default {
    data(){
        return {
            msg:'hello,vue3+webpack5'
        }
    },
    mounted(){
        console.log('__VUE_OPTIONS_API__',__VUE_OPTIONS_API__)
        console.log('__VUE_PROD_DEVTOOLS__',__VUE_PROD_DEVTOOLS__)
    }
}
</script>
<style lang="scss" scoped>
#app{
   text-align: center;
   font-size: 14px;
   color:rgba(0,0,0,.8);
}
</style>