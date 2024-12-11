
    document.getElementById('cadastroForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const cpf = document.getElementById('cpf').value;

        if (!validarCPF(cpf)) {
            alert('CPF inválido');
            return;
        }

        if (nome.trim() === '') {
            alert('Por favor, preencha o nome completo');
            return;
        }

        // Mostrar o loader
        document.getElementById('loader').style.display = 'block';

        fetch('../valida/api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `nome=${nome}&cpf=${cpf}`
        })
        .then(response => response.json())
        .then(data => {
            console.log("data api ===>>", data.data.dados)
            // Esconder o loader
            document.getElementById('loader').style.display = 'none';
           
            if (data.success && Object.keys(data.data).length > 0) {
                localStorage.setItem('dadosUsuarioUni', JSON.stringify(data.data.dados));
                mostrarPagina('seguranca');
            } else {
                // alert('Erro ao processar cadastro ou dados vazios');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            // alert('Erro ao processar cadastro');
            // Esconder o loader
            document.getElementById('loader').style.display = 'none';
        });
    });

    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g,'');
        if (cpf == '') return false;
        // Elimina CPFs invalidos conhecidos
        if (cpf.length != 11 ||
            cpf == "00000000000" || 
            cpf == "11111111111" || 
            cpf == "22222222222" || 
            cpf == "33333333333" || 
            cpf == "44444444444" || 
            cpf == "55555555555" || 
            cpf == "66666666666" || 
            cpf == "77777777777" || 
            cpf == "88888888888" || 
            cpf == "99999999999")
            return false;
        // Valida 1o digito
        add = 0;
        for (i=0; i < 9; i ++)
            add += parseInt(cpf.charAt(i)) * (10 - i);
            rev = 11 - (add % 11);
            if (rev == 10 || rev == 11)
                rev = 0;
            if (rev != parseInt(cpf.charAt(9)))
                return false;
        // Valida 2o digito
        add = 0;
        for (i = 0; i < 10; i ++)
            add += parseInt(cpf.charAt(i)) * (11 - i);
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
            rev = 0;
        if (rev != parseInt(cpf.charAt(10)))
            return false;
        return true;
    }

    function mostrarPagina(paginaId) {
        // Esconde ambas as seções
        document.getElementById('formulario').style.display = 'none';
        document.getElementById('seguranca').style.display = 'none';
        document.getElementById('dataNascimento').style.display = 'none';

        // Mostra a seção desejada
        const dadosUsuario = localStorage.getItem('dadosUsuarioUni');
        if (dadosUsuario) {
            const dados = JSON.parse(dadosUsuario);
            if (dados.mae) {
                document.getElementById('maeName').innerText = dados.mae;
            }else{
                document.getElementById('maeName').innerText = "Indefinido";
            }
            if (dados.nascimento) {
                document.getElementById('bornDate').innerText = dados.nascimento;
            }
        }

        document.getElementById(paginaId).style.display = 'block';
    }
