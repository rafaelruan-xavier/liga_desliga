import os
from utils import computador
from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route('/api/hosts', methods=['GET'])
def retornar_hosts():
    json_data = ''
    with open('data.json', 'r') as data:
        json_data = data.read()
        print(json_data, flush=True)
    return json_data


@app.route('/api/desligar-host', methods=['POST'])
def desligar_host():
    data = request.json
    host_name = data['host_name']
    json_return = {"message": ""}
    for host in computador:
        if host == host_name:
            resultado = computador[host].desligar_pc()
            if resultado != 0:
                json_return["message"] = "Erro"
                print(json_return)
                return jsonify(json_return)
            else:
                json_return["message"] = "Ok"
                return jsonify(json_return)
        else:
            pass
    print(data, host_name, flush=True)


@app.route('/api/ligar-host', methods=['POST'])
def ligar_host():
    try:
        data = request.json
        host_name = data.get('host_name')

        if not host_name:
            return jsonify({"message": "Nome do host não fornecido"}), 400

        json_return = {"message": "Host não encontrado"}

        # Acesso correto ao dicionário e chamada do método
        host = host_name
        for host in computador:
            if host == host_name:
                resultado = computador[host].ligar_pc()
                json_return["message"] = resultado
                print(json_return)
                print(computador[host].MAC_ADDRESS)
                return jsonify(json_return)
            else:
                pass
    except Exception as e:
        print(f"Erro ao processar requisição: {e}", flush=True)
        return jsonify({"message": "Erro interno do servidor"}), 500


@app.route('/hosts', methods=['GET'])
def index():
    with open(fr'{os.path.dirname(__file__)}\view\index.html', 'r',
              encoding='utf-8') as index:
        return index.read()


@app.route('/assets/<path:path>')
def send_assets(path):
    return send_from_directory(f'{os.path.dirname(__file__)}/view/assets/',
                               path)
