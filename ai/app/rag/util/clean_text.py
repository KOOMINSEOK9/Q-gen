import re

def clean_text(text: str) -> str:
    text = "".join(text)
    text = re.sub(r"[^\w\s]", "", text)
    return re.sub(r"\s+", " ", text).strip()