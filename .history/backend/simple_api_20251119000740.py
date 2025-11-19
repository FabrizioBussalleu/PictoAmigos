from backend.api import create_app
from backend.models.simple_predictor import SimpleChatPredictor

predictor = SimpleChatPredictor()
app = create_app(predictor=predictor)


def run_server(host: str = "127.0.0.1", port: int = 8000) -> None:
    import uvicorn

    uvicorn.run("backend.simple_api:app", host=host, port=port, reload=False)


if __name__ == "__main__":
    run_server()
