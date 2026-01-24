import re
import sys

def transform_dialogue_box(content):
    """Transform dialogue boxes to use Typewriter component"""

    # Pattern to match dialogue-text blocks with their content and buttons
    # This will match from <p className="dialogue-text"> to the closing button
    pattern = r'(<p className="dialogue-text">)(.*?)(</p>\s*<button className="continue-btn")(.*?)(>.*?</button>)'

    def replace_block(match):
        prefix = match.group(1)  # <p className="dialogue-text">
        text_content = match.group(2)  # The actual text with <br /> tags
        button_start = match.group(3)  # </p><button className="continue-btn"
        button_attrs = match.group(4)  # button attributes like onClick
        button_end = match.group(5)  # >Text</button>

        # Clean up the text content
        # Remove <br /> tags and convert to newlines
        cleaned_text = text_content.strip()
        cleaned_text = re.sub(r'<br\s*/>\s*<br\s*/>', '\n\n', cleaned_text)
        cleaned_text = re.sub(r'<br\s*/>', '\n', cleaned_text)
        cleaned_text = cleaned_text.replace('\\n\\n', '\n\n')
        cleaned_text = cleaned_text.replace('\\n', '\n')

        # Create the const declaration for the text
        # We'll use backticks for template literals
        text_const = f'`{cleaned_text}`'

        # Create the transformed block
        transformed = f'''{{isTyping ? (
                                <Typewriter text={text_const} onComplete={{handleTypingComplete}} />
                            ) : (
                                <button className="continue-btn fade-in"{button_attrs}{button_end}
                            )}}'''

        return transformed

    # Apply the transformation
    result = re.sub(pattern, replace_block, content, flags=re.DOTALL)

    return result

def transform_dialogue_box_with_choices(content):
    """Transform dialogue boxes that have choice buttons instead of continue button"""

    # Pattern for dialogue boxes with multiple choice buttons
    pattern = r'(<p className="dialogue-text">)(.*?)(</p>\s*)((?:<button className="choice-btn".*?</button>\s*)+)'

    def replace_block(match):
        prefix = match.group(1)
        text_content = match.group(2)
        closing_p = match.group(3)
        buttons_block = match.group(4)

        # Clean up the text content
        cleaned_text = text_content.strip()
        cleaned_text = re.sub(r'<br\s*/>\s*<br\s*/>', '\n\n', cleaned_text)
        cleaned_text = re.sub(r'<br\s*/>', '\n', cleaned_text)

        text_const = f'`{cleaned_text}`'

        # Add fade-in class to all buttons
        buttons_with_fade = re.sub(
            r'<button className="choice-btn"',
            '<button className="choice-btn fade-in"',
            buttons_block
        )

        transformed = f'''{{isTyping ? (
                                <Typewriter text={text_const} onComplete={{handleTypingComplete}} />
                            ) : (
                                <>{buttons_with_fade}</>
                            )}}'''

        return transformed

    result = re.sub(pattern, replace_block, content, flags=re.DOTALL)

    return result

def main():
    file_path = r'D:\MLN133\MLN133\src\components\Screens\Chapter1Screen.jsx'

    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    print(f"Original file size: {len(content)} characters")
    print(f"Original dialogue-text count: {content.count('dialogue-text')}")

    # Apply transformations
    content = transform_dialogue_box(content)
    content = transform_dialogue_box_with_choices(content)

    print(f"After transformation dialogue-text count: {content.count('dialogue-text')}")

    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("Transformation complete!")

if __name__ == '__main__':
    main()
