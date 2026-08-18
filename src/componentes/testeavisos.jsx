import axios from "axios" ;

function TesteAxios(){
  async function Exemplo() { 
     try {
         // axios.get() retorna um objeto de resposta
         const resposta = await axios.get(
          "https://jsonplaceholder.typicode.com/users/1",
        );
        // responda.data ja e o objeto JavaScript
       // nao precisa de . json() - / Axios faz isso automaticamente
       console.log('response' , resposta);
       console.log('response data' , resposta.data);
       console.log(resposta.data.name);  //'leanne graham
       console.log (resposta.data.email); //'leanne graham'
       console.log(resposta.status);  // 200
     } catch (erro) {
       console.log (erro.message);
    }
  }

  return (
    Exemplo
  )

}

export default TesteAxios