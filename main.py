from api import servidor
from multiprocessing import Process
from utils import rodar_loop_verificacao, iniciar_rotinas


if __name__ == '__main__':
    loop_verificacao = Process(target=rodar_loop_verificacao)
    rotinas = Process(target=iniciar_rotinas)
    rotinas.start()
    loop_verificacao.start()
    servidor.run(host='localhost', port=81, debug=False)
    loop_verificacao.join()
    rotinas.join()
