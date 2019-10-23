export const mixin={
    created(){

    },
    methods:{
        changePage(e){
            this.params.page.current = e;
            console.log(1)
            this.getInitList();
        }
    }
}