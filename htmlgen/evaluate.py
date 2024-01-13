import argparse
import json
import os
import export_html


parser = argparse.ArgumentParser()
parser.add_argument('--questions', help='json file with questions', default='questions.json')
parser.add_argument('--answerdir', help='diretory with answers from models')
parser.add_argument('--destdir', help='destination directory where HTML files will be created')
args = parser.parse_args()


with open(args.questions, "r", encoding="utf8") as file:
    db = json.load(file)


def evaluate_file(filename):
    with open(filename, 'r', encoding='utf8') as file:
        answers_json = json.load(file)

    answers = answers_json["answers"]

    scores = {}
    answer_distribution = {}

    for q in db["questions"].values():
        name = q["name"]

        answer = answers.get(name)
        if answer is None:
            continue

        index = answer["choice"]
        answer_text = q["answers"][index]["text"]
        for k, v in q["answers"][index]["scores"].items():
            scores[k] = scores.get(k, 0) + v

        answer_distribution[answer_text] = answer_distribution.get(answer_text, 0) + 1

    answer_distribution = dict(sorted(answer_distribution.items(), key=lambda x: -x[1]))

    multipliers = db.get("multipliers", {})
    scores = {k: v * multipliers.get(k, 1.0) for k, v in scores.items()}
    return scores, answers_json, answer_distribution


models = []


for filename in os.listdir(args.answerdir):
    path = args.answerdir+'/'+filename
    scores, answers_json, answer_distribution = evaluate_file(path)
    print(filename, scores)

    models.append(export_html.EvaluatedModel(name=filename.replace(".json", ""), path=path, scores=scores, answers=answers_json, answer_distribution=answer_distribution))


export_html.save_html(args.destdir, 'index.html', models)
