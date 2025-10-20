from models.predict import ChatPredictor

# Crear instancia del predictor
predictor = ChatPredictor()
print("Predictor creado correctamente")

# Probar predicción
test_text = "hola quiero jugar"
result = predictor.process_message(test_text)

print(f"\nTexto: '{test_text}'")
print(f"Intención predicha: {result['decided_intent']}")
print(f"Probabilidad: {result['best_prob']:.3f}")
print(f"Respuesta: {result['response']}")
print(f"Pictogramas: {result['pictos']}")