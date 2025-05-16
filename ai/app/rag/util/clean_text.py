import re

def clean_text(text: str) -> str:
    text = "".join(text)
    # 특수문자를 가능한 많이 허용. 필요한 기호는 여기 추가 가능.
    text = re.sub(r"[^\w\s\n\-~!@#$%^&*()_+={}\[\]:;\"'<>.,?/\\|ⓐ-ⓩⒶ-Ⓩ①-⑳❶-❿㉠-㉿∧∈·⇒≠]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text