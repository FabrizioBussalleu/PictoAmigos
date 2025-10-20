from utils.pictos_mapping import PictosMapper

# Crear instancia del mapeador
mapper = PictosMapper()
print("Mapeo cargado correctamente")

# Probar con texto de ejemplo
test_text = "hola quiero jugar"
pictos = mapper.map_text(test_text)
print(f"Ejemplo: '{test_text}' -> {pictos}")

# Probar con URLs
urls = mapper.map_text_with_urls(test_text, max_pictos=3)
print(f"URLs: {[u['url'] for u in urls]}")