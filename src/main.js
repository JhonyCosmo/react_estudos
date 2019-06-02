import api from './api';

class App{
    constructor(){
        this.repositories=[];
        this.formEl = document.getElementById('repo-form');
        this.listEl = document.getElementById('repo-list');
        this.inputEl = document.querySelector('input[name=repository]');
        this.registerHandlers();
    }

    registerHandlers(){
        this.formEl.onsubmit= event => this.addRepository(event);
    }

    setLoading(loading = true){
        if(loading===true){
            let loadingEl=document.createElement('span');
            loadingEl.appendChild(document.createTextNode('Carregando'));
            loadingEl.setAttribute('id','loading');
            this.formEl.appendChild(loadingEl);
        } else{
            document.getElementById('loading').remove();
        }
        
    }

    async addRepository(event){        
        //Nao premite que o form faça o reload
        //padrao do submit
        event.preventDefault();
        const repoInput=this.inputEl.value;
        //Verificando se foi escrito algo
        if(repoInput.length===0)
                return;
        //Mostrando mensagem de carregamento para o usuário
        this.setLoading(true);        
        
        try{
            //Buscando dados do web service do git hub
            const response = await api.get(`/repos/${repoInput}`);        
            //usando desestruturação para varrer o response
            const {name,description,html_url, owner:{avatar_url}}=response.data;
            console.log(response);
            //Usando short sintax para definir os valores
            this.repositories.push({
                name,
                description,
                avatar_url,
                html_url
            });

            this.inputEl.value='';
            /*  this.repositories.push({
                name:'rocketseat.com.br',
                description:'Tire a sua ideia do papel e dê vida à sua startup.',
                avatar_url:'https://avatars0.githubusercontent.com/u/28929274?v=4',
                html_url:'https://github.com/JhonyCosmo'
            });
            */

            console.log(this.repositories);
            //Mostrando resultado no DOM
            this.render();

        }catch(err){
          alert('O repositório não exise!');      
        }
        this.setLoading(false);
    }
    
    render(){
        //Limpando todos os elementos da lista
        this.listEl.innerHTML='';
         //Varrendo os repositorios
         this.repositories.forEach(repo=>{
             //Criando elementos
             let imgEl=document.createElement('img');
             imgEl.setAttribute('src',repo.avatar_url);
             let titleEl=document.createElement('strong');
             titleEl.appendChild(document.createTextNode(repo.name));
             let descriptionEl=document.createElement('p');
             descriptionEl.appendChild(document.createTextNode(repo.description));
             let linkEl=document.createElement('a');
             linkEl.setAttribute('target','_blank');
             linkEl.setAttribute('href',repo.html_url);
             linkEl.appendChild(document.createTextNode('Acessar'));
             let listItemEl=document.createElement('li');
             //Adicionando elementos
             listItemEl.appendChild(imgEl);
             listItemEl.appendChild(titleEl);
             listItemEl.appendChild(descriptionEl);
             listItemEl.appendChild(linkEl); 
             //Adicionando item na lista
             this.listEl.appendChild(listItemEl);
         });
    }

}
new App();  