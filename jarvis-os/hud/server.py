#!/usr/bin/env python3
"""Server local minimo para el HUD de JARVIS OS.

Sirve index.html y expone /api/estado, que lee el vault y devuelve el
snapshot del dia (metricas, plan, agenda, ultimo cierre) como JSON.
Sin dependencias fuera de la libreria estandar de Python.

Uso:
    python3 server.py
    -> abrir http://localhost:8765
"""
import json
import re
from datetime import date
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

HERE = Path(__file__).parent
VAULT = HERE.parent / "vault"
PORT = 8765


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.exists() else ""


def parse_metricas_table(md: str) -> list[dict]:
    rows = []
    for line in md.splitlines():
        m = re.match(r"^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|$", line)
        if m and m.group(1).lower() != "fuente" and not re.match(r"^-+$", m.group(1)):
            rows.append({
                "fuente": m.group(1).strip(),
                "valor": m.group(2).strip(),
                "delta": m.group(3).strip(),
                "origen": m.group(4).strip(),
            })
    return rows


def parse_plan(md: str) -> list[dict]:
    items = []
    for line in md.splitlines():
        m = re.match(r"^\d+\.\s*\[([ x])\]\s*(.+)$", line)
        if m:
            items.append({"hecho": m.group(1) == "x", "texto": m.group(2).strip()})
    return items


def estado_del_dia() -> dict:
    hoy = date.today().isoformat()

    metricas_md = read_text(VAULT / "medio" / "metricas" / f"{hoy}.md")
    inbox_md = read_text(VAULT / "medio" / "inbox" / f"{hoy}.md")
    plan_md = read_text(VAULT / "medio" / "plan" / f"{hoy}.md")
    agenda_md = read_text(VAULT / "pedidos" / "agenda.md")

    return {
        "fecha": hoy,
        "metricas": parse_metricas_table(metricas_md),
        "inbox_presente": bool(inbox_md.strip()),
        "inbox_raw": inbox_md,
        "plan": parse_plan(plan_md),
        "agenda_raw": agenda_md,
    }


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass  # silencioso

    def do_GET(self):
        if self.path == "/api/estado":
            body = json.dumps(estado_del_dia()).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        path = "index.html" if self.path == "/" else self.path.lstrip("/")
        file_path = HERE / path
        if not file_path.exists() or not file_path.is_file():
            self.send_response(404)
            self.end_headers()
            return
        content_type = "text/html" if file_path.suffix == ".html" else "text/plain"
        body = file_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    print(f"HUD de JARVIS OS en http://localhost:{PORT}")
    HTTPServer(("localhost", PORT), Handler).serve_forever()
