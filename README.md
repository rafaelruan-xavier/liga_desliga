# <h1>Liga/Desliga via Rede</h1>
![Interface](doc/interface.jpeg)



## Indice:
- <a href='#topico_1'><p style='font-size: 16px'>Do que se trata?</p></a>
- <a href='#topico_2'><p style='font-size: 16px'>Considerações para funcionamento</p></a>
- <a href='#topico_3'><p style='font-size: 16px'>Como configurar a máquina alvo?</p></a>
- <a href='#topico_4'><p style='font-size: 16px'>Funcionamento e implementação</p></a>
<br> <br>
<hr>
<h1 id='topico_1'><center>Do que se trata?</center></h1>
Em um ambiente empresarial, como uma instituição de ensino, os colaboradores de suporte de T.I muitas das vezes precisam caminhar no prédio para ligar computador por computador das salas de aula, ou desligá-los para evitar desperdício de energia, então desenvolvi este sistema onde é possível ligar e desligar os computadores via rede e configurar horários para ligar ou desligar automaticamente. <br> 
Para a ação de ligar uma máquina via rede, a aplicação enviará um <strong>Magic Packet</strong> (nome dado ao pacote via rede para despertar um computador) para a máquina selecionada na interface, sendo assim, ativando sua placa de rede e ligando a mesma, este pacote contém o endereço MAC da máquina destino, este processo é conhecido como <strong>Wake On Lan</strong>. <br>
Para a ação de desligar uma máquina via rede, a aplicação enviará o comando shutdown remotamente para a máquina selecionada na interface. <br> <br> <hr>

<h1 id ='topico_2'><center>Considerações para o funcionamento</center></h1>

<p style='font-size: 16px'>[X] O servidor da aplicação e as máquinas destino devem estar na mesma faixa de rede.</p>
<p style='font-size: 16px'>[X] As máquinas destino devem suportar o Wake On Lan.</p>

<br>  <hr>
<h1 id ='topico_3'><center>Como configurar a máquina alvo?</center></h1>

<h2>Config de Firewall:</h2>
<p style='font-size: 16px'>[X] Criar uma regra de entrada no Firewall para protocolo ICMPv4 (Particular, Privada e Publica)</p>
<p style='font-size: 16px'>[X] Habilitar "Compartilhamento de Arquivo e Impressora (SMB-Entrada)" e permitir para rede particular, privada e publica.</p>
<h2>Config de bios:</h2>
<p style='font-size: 16px'>[X] Habilitar Wake-On-Lan.</p>
<br>
<h1><center>Funcionamento e implementação</center></h1>
<h2>Config de ambiente</h2>
<p><strong>1- Arquivo "main.py": </strong> <br>
- Atribuir o valor do parâmetro "host" como IP do servidor. (linha 11)<br></p>
<p><strong>2- Arquivo "/api/view/assets/js/scripts.js":</strong><br>
- Alterar valor da variável "ip_host" para ip do servidor. (linha 2)</p>

<p><strong>3- Arquivo "/utils/.env":</strong><br>
- Inserir o Json contendo os dados das máquinas destino. Use o seguinte formato: <br>
{ "Nome da máquina": ["Ip da maquina", "MacAddress da máquina"] } <br>
Exemplo abaixo: <br> <br>
<img src="doc/enviroment.png" alt="enviroment">


<p><strong>4- Instalar as dependências do projeto > requirements.txt</strong></p>

<h2>Como rodar?</h2>
<p>Depois de realizar as configurações de ambiente, execute o arquivo <strong>main.py</strong>. <br>
Após executar, a interface web já estará no ar, pelo endereço <strong>http://ip_do_servidor:81/hosts</strong></p>
