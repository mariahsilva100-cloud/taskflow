const express = require('express');

const app = express();
const PORTA = 3001;
const tarefas = [{id:1 , texto: 'Estudar Node', coluna: 'afazer'},];

app.get('/', (req, res) => {
    res.json({ mensagem: 'Taskflow API funcionando!' });
});
    app.get('/',tarefas, (req, res) => {
        res.json({ mensagem: 'Taskflow API funcionando!' });

        app.listen(PORTA, () => {
            console.log(`Servidor rodando em http:${PORTA}`);
        });
        
 });

        
