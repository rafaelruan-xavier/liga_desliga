from utils.classes import Host
from os import path
from time import sleep
import json
import schedule
from time import sleep


computador = {}
with open(f'{path.dirname(__file__)}/.env', 'r') as enviroment:
    json_env = enviroment.read()
    enviroment.close()
    json_env = json.loads(json_env)
    for sala in json_env:
        print(json_env.get(sala))
        ip_do_host = json_env.get(sala)[0]
        macaddress_do_host = json_env.get(sala)[1]
        computador.update({sala: Host(
            ip_address=ip_do_host,
            HOST_NAME=sala,
            MAC_ADDRESS=macaddress_do_host
            )})


def rodar_loop_verificacao():
    global json_data
    json_data = {"computadores": []}
    print("Iniciando o loop de verificação", flush=True)
    while True:
        for host in computador:
            computador[host].verificar_status()
            json_data["computadores"] = [computador[x].to_json() for x in computador]
            with open('data.json', 'w') as data:
                json.dump(json_data, data, indent=1)
        sleep(3)


def desligar_todos():
    for host in computador:
        computador[host].desligar_pc()


def ligar_todos():
    for host in computador:
        computador[host].ligar_pc()


schedule.every().monday.at('07:00').do(ligar_todos)
schedule.every().monday.at('18:00').do(ligar_todos)
schedule.every().monday.at('12:30').do(desligar_todos)
schedule.every().monday.at('23:30').do(desligar_todos)

schedule.every().tuesday.at('07:00').do(ligar_todos)
schedule.every().tuesday.at('18:00').do(ligar_todos)
schedule.every().tuesday.at('12:30').do(desligar_todos)
schedule.every().tuesday.at('23:30').do(desligar_todos)

schedule.every().wednesday.at('07:00').do(ligar_todos)
schedule.every().wednesday.at('18:00').do(ligar_todos)
schedule.every().wednesday.at('12:30').do(desligar_todos)
schedule.every().wednesday.at('23:30').do(desligar_todos)

schedule.every().thursday.at('07:00').do(ligar_todos)
schedule.every().thursday.at('18:00').do(ligar_todos)
schedule.every().thursday.at('12:30').do(desligar_todos)
schedule.every().thursday.at('23:30').do(desligar_todos)

schedule.every().friday.at('07:00').do(ligar_todos)
schedule.every().friday.at('18:00').do(ligar_todos)
schedule.every().friday.at('12:30').do(desligar_todos)
schedule.every().friday.at('23:30').do(desligar_todos)

schedule.every().saturday.at('07:00').do(ligar_todos)
schedule.every().saturday.at('19:00').do(desligar_todos)


def iniciar_rotinas():
    print('Rotinas iniciadas')
    while True:
        schedule.run_pending()
        sleep(1)
