import os
import re

cached_templates = {}
cached_globals = None

re_code = re.compile("{{(.*?)}}", re.DOTALL)


def replacement(m, loc, glb):
    obj = eval(m.group(1), glb, loc)

    if type(obj) == list:
        return "".join([str(x) for x in obj])

    return str(obj)


def html_template(filename, loc=None, glb=None):
    global cached_globals

    if filename in cached_templates:
        text = cached_templates[filename]
    else:
        with open(os.path.join('html_templates', filename), "r", encoding="utf8") as file:
            text = file.read()

    if glb is not None:
        cached_globals = glb
    else:
        glb = cached_globals

    text = re.sub(re_code, lambda m: replacement(m, loc, glb), text)

    return text
