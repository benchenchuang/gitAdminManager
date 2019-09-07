<template>
    <div>
        <transition mode="out-in" enter-active-class="fadeInDown" leave-active-class="fadeOutUp">
            <router-view class="animated" />
        </transition>
    </div>
</template>
