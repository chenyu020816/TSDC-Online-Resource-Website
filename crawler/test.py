from translate import Translator

def translate_keyword(keyword):
    translator = Translator(from_lang='zh', to_lang='en')
    result = translator.translate(keyword)
    return result


print(translate_keyword('統計學'))