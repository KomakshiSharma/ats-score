import re


def preprocess(text):

    text = text.lower()

    text = re.sub(
        r'[^a-zA-Z0-9\s]',
        '',
        text
    )

    return text


def extract_keywords(text):

    text = preprocess(text)

    words = text.split()

    stop_words = {
        "the",
        "and",
        "or",
        "for",
        "with",
        "a",
        "an",
        "to",
        "of",
        "in",
        "on",
        "at",
        "is",
        "are",
        "be"
    }

    keywords = set()

    for word in words:

        if len(word) > 2 and word not in stop_words:
            keywords.add(word)

    return keywords


def calculate_ats_score(
    resume_text,
    job_description
):

    resume_keywords = extract_keywords(
        resume_text
    )

    jd_keywords = extract_keywords(
        job_description
    )

    matched = list(
        resume_keywords.intersection(
            jd_keywords
        )
    )

    missing = list(
        jd_keywords.difference(
            resume_keywords
        )
    )

    if len(jd_keywords) == 0:
        score = 0
    else:
        score = round(
            (
                len(matched)
                / len(jd_keywords)
            ) * 100
        )

    suggestions = []

    for skill in missing[:10]:
        suggestions.append(
            f"Consider adding '{skill}' if relevant to your experience."
        )

    return {
        "score": score,
        "matched": sorted(matched),
        "missing": sorted(missing),
        "suggestions": suggestions
    }
