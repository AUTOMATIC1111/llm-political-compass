import dataclasses
import json

import html
import html_template
import os
import shutil


@dataclasses.dataclass
class EvaluatedModel:
    name: str
    path: str
    scores: dict
    answers: dict
    answer_distribution: dict


def copyfile(src, dst):
    if not os.path.exists(dst) or os.stat(src).st_mtime > os.stat(dst).st_mtime:
        shutil.copyfile(src, dst)


def save_html(path, filename, models):
    copyfile('html_templates/script.js', os.path.join(path, 'script.js'))
    copyfile('html_templates/style.css', os.path.join(path, 'style.css'))
    copyfile('html_templates/apexcharts.js', os.path.join(path, 'apexcharts.js'))
    copyfile('html_templates/apexcharts.css', os.path.join(path, 'apexcharts.css'))
    copyfile('html_templates/sortable.js', os.path.join(path, 'sortable.js'))
    copyfile('html_templates/sortable.css', os.path.join(path, 'sortable.css'))

    models_json = [
        {
            "name": f'{i+1}. {model.name.replace(".json", "")}',
            "data": [[model.scores["ec"], model.scores["soc"]]]
        }
        for i, model in enumerate(models)
    ]

    loc = {
        "models": models,
        "models_json": json.dumps(models_json),
    }

    with open(os.path.join(path, filename), "w", encoding="utf8") as file:
        file.write(html_template.html_template("index.html", loc, globals()))

    os.makedirs(os.path.join(path, 'models'), exist_ok=True)

    for model in models:
        with open(os.path.join(path, 'models', model.name + ".html"), "w", encoding="utf8") as file:
            loc = {
                "model": model,
            }

            file.write(html_template.html_template("log.html", loc, globals()))
