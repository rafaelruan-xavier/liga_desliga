from subprocess import run as rodar_comando
from wakeonlan import send_magic_packet


class Host():
    def __init__(
            self,
            ip_address: str,
            HOST_NAME: str,
            MAC_ADDRESS: str,
            status: bool = False,
            ) -> None:
        self.__ip_address = ip_address
        self.__HOST_NAME = HOST_NAME
        self.__status = status
        self.MAC_ADDRESS = MAC_ADDRESS

    def set_status(self, valor: bool):
        self.__status = valor

    def get_status(self):
        return self.__status

    def desligar_pc(self):
        try:
            resultado = rodar_comando(
                ['powershell', f'shutdown /s /m {self.__ip_address} /t 0'],
                capture_output=True,
                text=True)
        except Exception:
            print('Função "desligar_pc()"',
                  ' - Falha ao realizar o comando via powershell.')
        else:
            if resultado.returncode != 0:
                print(f"""
Falha ao enviar comando para o HOST: {self.__HOST_NAME}
Motivo: {resultado.stderr}]""")
                return resultado.returncode
            else:
                print(f'Shutdown enviado para o HOST: {self.__HOST_NAME}')
                return resultado.returncode

    def ligar_pc(self):
        try:
            send_magic_packet(F'{self.MAC_ADDRESS}')
        except Exception:
            print('Função "ligar_pc()" - Falha ao enviar pacote.')
            return 'Error'
        else:
            print(f'Pacote enviado ao HOST: {self.__HOST_NAME}')
            return 'Ok'

    def verificar_status(self):
        try:
            resultado = rodar_comando(
                ['powershell', f'ping -n 1 {self.__ip_address}'],
                capture_output=True,
                text=True)
        except Exception:
            print('Função "verificar_status()"',
                  '- Falha ao realizar o comando via powershell.')
        else:
            if resultado.returncode != 0:
                print(f'O comando enviado ao HOST: {self.__HOST_NAME}',
                      'não obteve resultados.', flush=True)
                self.set_status(valor=False)
            elif 'inacess' in resultado.stdout:
                print('Inacessivel')
                self.set_status(valor=False)
            else:
                self.set_status(valor=True)

    def to_json(self):
        return {
            "status": f"{self.__status}",
            "host_name": self.__HOST_NAME
        }
