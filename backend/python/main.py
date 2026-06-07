import sys
import json

from parser import extract_resume_text
from ats_score import calculate_ats_score

try:

    resume_path = sys.argv[1]
    job_description = sys.argv[2]

    resume_text = extract_resume_text(
        resume_path
    )

    result = calculate_ats_score(
        resume_text,
        job_description
    )

    print(json.dumps(result))

except Exception as e:

    print(
        json.dumps(
            {
                "success": False,
                "error": str(e)
            }
        )
    )

    sys.exit(1)
