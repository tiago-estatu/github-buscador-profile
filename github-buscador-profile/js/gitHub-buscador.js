(function(){
    'use strict';

    /* TIAGO ESTATU
        tiagoestatu@hotmail.com
    */

    /* GLOBAL
    -------------------------------------------------------------------------------*/
    //Armazenando os targets do DOM    
    /***************  TODAS VARIÁVEIS PRECEDIDAS COM O SINAL ($) ***************
     * *************  ARMAZENAM ELEMENTOS CAPTURADOS NO DOM  ********************
    **************************************************************************/
    var $userNameInputValue = document.querySelector('#userNameInputValue');
    var $btnBuscarProfile = document.querySelector('#btnBuscarProfile');
    var $insereResultado = document.querySelector('#insereResultado');


    //Caminho base da URL para chamada API
    //https://api.github.com/
    const caminhoPastaBase = "https://api.github.com/users/";

   /* 

    //Header to be send
   const myHeader = {
    method: 'GET',
      headers: {
          'Accept':'application/json',
          'Authorization': 'token 000000000000000000000',
      },
      credentials:'include',
      mode: 'cors',
      cache: 'default' 
      
  } 
*/


    /* FECHA GLOBAIS
    -------------------------------------------------------------------------------*/


    //Limpar o campo busca antes do usuário digitar qualquer valor
    //Remover a class campo obrigatótio "errorRequiredFiled"
    $userNameInputValue.addEventListener('focus', () => {
        $userNameInputValue.classList.remove('errorRequiredFiled');
        $userNameInputValue.value = "";          
    });
    
    

    // CHAMADA AJAX
    //Recebo a URL que deverá ser "consultada"
    const ajaxCaller = async (user) => {
        //URL CHAMADA
        const api_call = await fetch(`${caminhoPastaBase}${user}`);
            
        //JSON CONVERTE     
        const data = await api_call.json();

        //Tramento de erro
        if(api_call.ok != true){
            
            //Se o status.ok da chamada NÃO FOR OK
            //Retornamos NULL como parametro para a função de erro. 
            return {data: null};
            throw Error(api_call.statusText);

        }else{
            // Se o status.ok ,
            // Retornamos os dados
            return {data};
        }
    }


    // MANUPULAÇÃO DOS DADOS DE RETORNO DA CHAMDA AJAX
    const getResultados = () => {

        //Campo busca diferente de Vazio, executo a chamada ajax
        if ($userNameInputValue.value !== "") {
           
            //Ajax call
            ajaxCaller($userNameInputValue.value).then((response) => {
            
                //Se existir conteúdo na resposta executa htmlPrinter()
                // Senão executa htmlPrinterError()
                response.data != null ? htmlPrinter(response): htmlPrinterError();
             
            })

         } else {
            // Se o campo busca estiver vazio
            // Mostro a mensagem de erro
            $userNameInputValue.value = 'Nome de login!';
            $userNameInputValue.classList.add('errorRequiredFiled');
        }

    }


    //DISPARO O EVENTO DA CONSULTA 
    //CHAMA A FUNÇÃO QUE CONTÉM A (AJAX CALLER)
    $btnBuscarProfile.addEventListener('click', () => {
        getResultados();    
    });


    //FUNÇÃO QUE ESCREVE O HTML A SER PRINTADO
    //Recebo os dados para fazer o Html-output
    const htmlPrinter = (response) => {
       
        //Sempre limpo o conteudo atual antes de escrever 
        $insereResultado.innerHTML ="";


            /****** OS ELEMENTOS COM TARGET_BLANK RECEBEM A URL COM O FORMATO:
             *   
             * ${response.data.html_url} + ?tab= + tabDesejada
             * https://github.com/tiago-estatu?tab=repositories
             * https://github.com/tiago-estatu?tab=followers
            */

            //Preparo o HTml Output
            $insereResultado.insertAdjacentHTML('afterbegin',`
            <ul class="listResultadoHtmlPrinter"> 
                <li><a target="_blank" href="${response.data.html_url}"><img src="${response.data.avatar_url}" alt="" with="200" height="200"></a></li>
                <li>Nome: <a target="_blank" href="${response.data.html_url}">${response.data.name}</a></li>
                <li>Login: ${response.data.login}</li>
                <li>Repositories: <a target="_blank" href="${response.data.html_url}?tab=repositories">${response.data.public_repos}</a></li>
                <li>Seguidores: <a target="_blank" href="${response.data.html_url}?tab=followers">${response.data.followers}</a></li>
                <li>Localização: ${response.data.location}</li>
                <li>Url: <a target="_blank" href="${response.data.html_url}">${response.data.html_url}</a></li>
            </ul>`);
    }

    //FUNÇÃO QUE ESCREVE O HTML A SER PRINTADO QUANDO ERRO NA RESPOSTA DO AJAX
    //Função print mensagem de erro
    const htmlPrinterError = () => {
        //Sempre limpo o conteudo atual antes de escrever 
        $insereResultado.innerHTML ="";
        $insereResultado.innerHTML = `<span class="usuarioNaoEncontrado">Desulpe usuário não encontrado, tente novamente Ex: gympass!</span>`;
    }
    
})();

