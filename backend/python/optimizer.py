# python/optimizer.py

import re


class ResumeOptimizer:

    def __init__(self, resume_text, job_description):
        self.resume_text = resume_text.lower()
        self.job_description = job_description.lower()

    def extract_keywords(self, text):
        """
        Basic keyword extraction.
        Replace with spaCy later for better accuracy.
        """

        stop_words = {
            "the", "and", "or", "for", "with", "a", "an",
            "to", "of", "in", "on", "at", "is", "are",
            "be", "as", "by", "from", "that", "this"
        }

        text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)

        words = text.split()

        keywords = set()

        for word in words:
            if len(word) > 2 and word not in stop_words:
                keywords.add(word)

        return keywords

    def get_missing_keywords(self):

        resume_keywords = self.extract_keywords(
            self.resume_text
        )

        jd_keywords = self.extract_keywords(
            self.job_description
        )

        missing = jd_keywords - resume_keywords

        return sorted(list(missing))

    def generate_suggestions(self):

        missing_keywords = self.get_missing_keywords()

        suggestions = []

        for keyword in missing_keywords[:15]:

            suggestions.append(
                f"Include experience or projects related to '{keyword}' if applicable."
            )

        return suggestions

    def check_sections(self):

        required_sections = [
            "education",
            "skills",
            "experience",
            "projects"
        ]

        missing_sections = []

        for section in required_sections:

            if section not in self.resume_text:
                missing_sections.append(section)

        return missing_sections

    def optimize(self):

        missing_keywords = self.get_missing_keywords()

        missing_sections = self.check_sections()

        suggestions = self.generate_suggestions()

        section_suggestions = []

        for section in missing_sections:
            section_suggestions.append(
                f"Add a '{section.title()}' section to improve ATS compatibility."
            )

        return {
            "missing_keywords": missing_keywords,
            "missing_sections": missing_sections,
            "keyword_suggestions": suggestions,
            "section_suggestions": section_suggestions
        }
