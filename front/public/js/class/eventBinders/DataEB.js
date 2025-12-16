export class DataEB {
    constructor() {
        this.boundHandleClickTask = this.handleClickTask.bind(this);
         this.boundHandleSubmit = this.handleSubmit.bind(this);
    }

    setController(controller) {
        this.controller = controller;
    }

    addEventListeners() {
        document.removeEventListener('click', this.boundHandleClickTask);
        document.addEventListener('click', this.boundHandleClickTask);
        document.removeEventListener('submit', this.boundHandleSubmit);
        document.addEventListener('submit', this.boundHandleSubmit);
    }

    async handleClickTask(e) {

    }

    async handleSubmit(e){
        e.preventDefault();
        const form = e.target.closest('#searchBar-form');
        if(form){
            const query = form.elements['query'].value;
            if(!query) return;
            const res = await this.controller.entreprises.getEntreprisesByQuery(query);
            console.log(res.data);
            await this.controller.dataView.render(res.data);
        }
    }




}

