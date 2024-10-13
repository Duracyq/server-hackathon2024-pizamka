import ollama
response = ollama.chat(model='llama2', messages=[
  {
    'role': 'user',
    'content': 'say HI',
  },
])
print(response['message']['content'])