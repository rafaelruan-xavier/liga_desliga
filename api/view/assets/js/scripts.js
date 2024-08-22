let previousData = null;
const ip_host = 'localhost' 
const port = '81'

function addEventListener() {
    fetch(`http://${ip_host}:${port}/api/hosts`)
        .then(response => response.json())
        .then(data => {
            if (!previousData || JSON.stringify(previousData) !== JSON.stringify(data)) {
                previousData = data;

                const container = document.getElementById('computadores-container');
                container.innerHTML = '';
                
                data.computadores.forEach(computador => {
                    const div = document.createElement('div');
                    div.className = `computador ${computador.status === 'True' ? 'online' : 'offline'}`;

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.className = 'computador-checkbox';
                    checkbox.value = computador.host_name;
                    div.appendChild(checkbox);

                    const h2 = document.createElement('h2');
                    h2.textContent = computador.host_name;
                    div.appendChild(h2);

                    const status = document.createElement('p');
                    status.className = 'status-text';
                    status.textContent = computador.status === 'True' ? 'Ligado' : 'Desligado';
                    status.style.color = computador.status === 'True' ? 'green' : 'gray';  // Atualiza a cor com base no status
                    div.appendChild(status);

                    // Criar botão "Desligar" ou "Ligar" com base no status
                    if (computador.status === 'True') {
                        const buttonDesligar = document.createElement('button');
                        buttonDesligar.className = 'desligar';
                        buttonDesligar.textContent = 'Desligar';
                        buttonDesligar.onclick = () => {
                            buttonDesligar.disabled = true;
                            status.textContent = 'Desligando...';
                            status.style.color = 'orange';

                            const hostName = computador.host_name;
                            console.log(`Desligando ${hostName}`);

                            const jsonData = { host_name: hostName };

                            fetch(`http://${ip_host}:${port}/api/desligar-host`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(jsonData)
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Erro ao enviar requisição');
                                }
                                return response.json();
                            })
                            .then(data => {
                                if (data.message === "Erro") {
                                    console.log(data);
                                    alert(`Não foi possível desligar ${hostName} - Erro no BackEnd`);
                                    status.textContent = 'Erro';
                                    status.style.color = 'red';
                                } else if (data.message === "Ok") {
                                    console.log('Resposta do backend:', data);
                                    alert(`Desligando ${hostName}`);
                                    status.textContent = 'Desligado';
                                    status.style.color = 'gray';
                                }
                            })
                            .catch(error => {
                                console.error('Erro:', error);
                                alert('Erro ao desligar o computador. Verifique a conexão com o servidor.');
                                status.textContent = 'Erro';
                                status.style.color = 'red';
                            })
                            .finally(() => {
                                buttonDesligar.disabled = false;
                            });
                        };
                        div.appendChild(buttonDesligar);
                    } else {
                        const buttonLigar = document.createElement('button');
                        buttonLigar.className = 'ligar';
                        buttonLigar.textContent = 'Ligar';
                        buttonLigar.onclick = () => {
                            const hostName = computador.host_name;
                            console.log(`Ligando ${hostName}`);
                
                            const jsonData = { host_name: hostName };

                            console.log(jsonData)
                
                            fetch(`http://${ip_host}:${port}/api/ligar-host`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(jsonData)
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Erro ao enviar requisição');
                                }
                                return response.json();
                            })
                            .then(data => {
                                if (data.message === "Erro") {
                                    console.log(data);
                                    alert(`Não foi possível ligar ${hostName} - Erro no BackEnd`);
                                } else if (data.message === "Ligado com sucesso") {
                                    console.log('Resposta do backend:', data);
                                    alert(`Ligando ${hostName}`);
                                    status.textContent = 'Ligado';
                                    status.style.color = 'green';
                                }
                            })
                            .catch(error => {
                                console.error('Erro:', error);
                                alert('Erro ao ligar o computador. Verifique a conexão com o servidor.');
                            });
                        };
                        div.appendChild(buttonLigar);
                    }

                    container.appendChild(div);
                });
            }
        })
        .catch(error => console.error('Erro ao buscar dados:', error));
}

// Função para desligar todos os computadores selecionados
document.getElementById('desligar-selecionados').addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.computador-checkbox:checked');
    const hostNames = Array.from(checkboxes).map(checkbox => checkbox.value);
    
    if (hostNames.length === 0) {
        alert('Nenhum computador selecionado.');
        return;
    }

    // Cria um array de promessas para todas as requisições
    const promises = hostNames.map(hostName => {
        const jsonData = { host_name: hostName };

        return fetch(`http://${ip_host}:${port}/api/desligar-host`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao enviar requisição');
            }
            return response.json();
        })
        .then(data => {
            if (data.message === "Erro") {
                console.log(data);
                alert(`Não foi possível desligar ${hostName} - Erro no BackEnd`);
            } else if (data.message === "Ok") {
                console.log('Resposta do backend:', data);
                alert(`Desligando ${hostName}`);
                document.querySelector(`.computador-checkbox[value="${hostName}"]`).parentNode.querySelector('.status-text').textContent = 'Desligando';
                document.querySelector(`.computador-checkbox[value="${hostName}"]`).parentNode.querySelector('.status-text').style.color = 'gray';
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao desligar o computador. Verifique a conexão com o servidor.');
        });
    });

    // Aguarda todas as promessas serem resolvidas
    Promise.all(promises)
        .then(() => {
            console.log('Todos os computadores selecionados foram desligados.');
        })
        .catch(error => {
            console.error('Erro ao desligar alguns computadores:', error);
        });
});

document.getElementById('ligar-selecionados').addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.computador-checkbox:checked');
    const hostNames = Array.from(checkboxes).map(checkbox => checkbox.value);
    
    if (hostNames.length === 0) {
        alert('Nenhum computador selecionado.');
        return;
    }

    // Cria um array de promessas para todas as requisições
    const promises = hostNames.map(hostName => {
        const jsonData = { host_name: hostName };

        return fetch(`http://${ip_host}:${port}/api/ligar-host`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao enviar requisição');
            }
            return response.json();
        })
        .then(data => {
            if (data.message === "Erro") {
                console.log(data);
                alert(`Não foi possível ligar ${hostName} - Erro no BackEnd`);
            } else if (data.message === "Ok") {
                console.log('Resposta do backend:', data);
                alert(`Desligando ${hostName}`);
                document.querySelector(`.computador-checkbox[value="${hostName}"]`).parentNode.querySelector('.status-text').textContent = 'Ligando';
                document.querySelector(`.computador-checkbox[value="${hostName}"]`).parentNode.querySelector('.status-text').style.color = 'green';
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao desligar o computador. Verifique a conexão com o servidor.');
        });
    });

    // Aguarda todas as promessas serem resolvidas
    Promise.all(promises)
        .then(() => {
            console.log('Todos os computadores selecionados foram ligados.');
        })
        .catch(error => {
            console.error('Erro ao ligar alguns computadores:', error);
        });
});



// Função para selecionar ou desmarcar todos os checkboxes
document.getElementById('selecionar-todos').addEventListener('change', (event) => {
    const isChecked = event.target.checked; // Verifica se o checkbox geral está marcado
    const checkboxes = document.querySelectorAll('.computador-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = isChecked; // Marca ou desmarca todos os checkboxes
    });
});

addEventListener();
setInterval(addEventListener, 10000);
