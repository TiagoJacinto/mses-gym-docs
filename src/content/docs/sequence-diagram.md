# Diagrama de Sequência

## Como Construir

1. Escolher um caso de uso
2. Identificar os objetos que fazem parte da interação
3. Identificar o objeto que inicia a interação
4. Identificar as mensagens trocadas entre os objetos
5. Representar o diagrama

## Elementos Essenciais

### Atores e Objetos

- **Ator:** Entidade externa que interage com o sistema
- **Objeto:** Instância de uma classe que participa na interação

**Notação:** `nome:Classe`

### Lifelines

Linha vertical tracejada que representa o tempo de vida de um participante.

### Mensagens

| Tipo        | Descrição                   |
| ----------- | --------------------------- |
| Síncrona    | Emissor espera resposta     |
| Assíncrona  | Emissor não espera resposta |
| Retorno     | Resposta (opcional)         |
| Autochamada | Objeto chama a si próprio   |

### Condições de Guarda

`[condição]` — a mensagem só é enviada se a condição for verdadeira.

### Iterações

`* mensagem(...)` — mensagem repetida num ciclo.

## Exemplo – "Criar Nota"

```
Utilizador : GUID : Forum : Controlador : Topico : Nota

1: criarNota(utilizador, idForum, idTopico, texto)
2: criarNota(utilizador, idForum, idTopico, texto)
3: consultarTopico(idTopico)
4: getDono()
5: [se dono == utilizador] newNota(texto, utilizador)
```

## Resumo

| Elemento    | Notação                           |
| ----------- | --------------------------------- |
| Ator/Objeto | `nome:Classe`                     |
| Lifeline    | `----------` (tracejada vertical) |
| Síncrona    | `mensagem()` →                    |
| Assíncrona  | `mensagem()` ⇢                    |
| Retorno     | `←------`                         |
| Condição    | `[guarda]`                        |
| Iteração    | `* mensagem()`                    |
