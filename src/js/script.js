document.addEventListener("DOMContentLoaded", function(){
    console.log("Documento carregado");

    //1. No JavaScript, pegar o evento de submit do formulário para evitar o recarregamento da página:
    const form = document.querySelector(".form-group");
    const textareaValue = document.getElementById("description");
    const previewSection = document.getElementById("preview-section");
    const htmlCode = document.getElementById("html-code");
    const cssCode = document.getElementById("css-code");

    form.addEventListener("submit", async function(event) {
        event.preventDefault(); //evita recarregamento da página

        //2. Obter o valor digitado pelo usuário no textarea:
        const description = textareaValue.value.trim();
        console.log(description);

        if(!description){
            return;
        }

        //3. Exibir um indicador de carregamento enquanto a requisição está sendo processada:
        mostrarCarregamento(true);

        //4. Faz uma requisição HTTP (POST) para a API do n8n, enviando o texto do formulário no corpo da requisição em formato de JSON:
        try{
            const response = await fetch ("https://lrsfjwr.app.n8n.cloud/webhook/fundo-magico", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ description })
            });

            const responseData = await response.json();
            htmlCode.textContent = responseData.html || "";
            cssCode.textContent = responseData.css || "";

            //5. Aplicar o preview como background
            previewSection.style.display = "block";
            previewSection.innerHTML = responseData.html || "";

            let styleTag = document.getElementById("dynamic-style");
            //se a tag já existir, removeremos ela antes de criar uma nova
            if(styleTag){
                styleTag.remove();
            }

            if(responseData.css){
                styleTag = document.createElement("style");
                styleTag.id= "dynamic-style";
                styleTag.textContent = responseData.css;
                document.head.appendChild(styleTag);
            }

        }catch(error){
            console.error("Erro ao enviar a requisição: ", error);
            htmlCode.textContent = "Não consegui gerar o HTML, tente novamente.";
            cssCode.textContent = "Não consegui gerar o CSS, tente novamente.";
            previewSection.innerHTML = "";
        }finally{
            mostrarCarregamento(false);
        }
    });

    function mostrarCarregamento (isLoading){
        const submitButton = document.getElementById("generate-btn");
        
        if(isLoading){
            submitButton.textContent = "Gerando background...";
        }else{
            submitButton.textContent = "Gerar background mágico"
        }
    }

});