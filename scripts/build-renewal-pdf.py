"""Build the existing two-page worksheet from the website's shared question data.

Requires reportlab and fonttools. Fonts come from the installed, pinned
@fontsource packages; no font download, account connection or PDF scripting.
"""
import json
from pathlib import Path
from tempfile import TemporaryDirectory

from fontTools.ttLib import TTFont as SourceFont
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import simpleSplit
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
PREFIX = 'export const renewalQuestions = '
source = (ROOT / 'src/data/softwareRenewal.ts').read_text()
assert source.startswith(PREFIX) and source.rstrip().endswith(';')
questions = json.loads(source[len(PREFIX):].rstrip()[:-1])
assert len(questions) == 8
OUTPUT = ROOT / 'public/downloads/before-you-renew-that-software.pdf'
WORDMARK = ROOT / 'public/images/brand/cloud-and-capital-wordmark.png'
CREAM, SAGE, ROSE = [HexColor(v) for v in ['#F5EEE9', '#3D6055', '#C8A5A5']]
INK, MUTED, LINE = [HexColor(v) for v in ['#24211E', '#5D5C54', '#B8C3B8']]
WHITE = HexColor('#FFFFFF')

with TemporaryDirectory(prefix='cc-renewal-fonts-') as font_dir:
    for name, package, filename in [
        ('BrandSerif', 'cormorant-garamond', 'cormorant-garamond-latin-600-normal.woff'),
        ('BrandItalic', 'cormorant-garamond', 'cormorant-garamond-latin-600-italic.woff'),
        ('BrandBody', 'jost', 'jost-latin-400-normal.woff'),
    ]:
        font_path = ROOT / 'node_modules/@fontsource' / package / 'files' / filename
        font = SourceFont(font_path)
        font.flavor = None
        converted = Path(font_dir) / (name + '.ttf')
        font.save(converted)
        pdfmetrics.registerFont(TTFont(name, str(converted)))

    c = canvas.Canvas(str(OUTPUT), pagesize=(612, 792), pageCompression=1, invariant=1)
    c.setTitle('Before you renew that software | Cloud & Capital')
    c.setAuthor('Cloud & Capital')
    c.setSubject('Eight questions, three important dates and a next step for one software renewal.')
    c.setCreator('Cloud & Capital worksheet builder')

    def text(x, y, value, font='BrandBody', size=10, color=INK):
        c.setFillColor(color)
        c.setFont(font, size)
        c.drawString(x, y, value)

    def field(name, tooltip, x, y, width, height=22, multiline=False):
        c.acroForm.textfield(
            name=name, tooltip=tooltip, x=x, y=y, width=width, height=height,
            fontName='Helvetica', fontSize=10.5, textColor=INK,
            fillColor=WHITE, borderColor=LINE, borderWidth=.6,
            borderStyle='solid', forceBorder=True,
            fieldFlags='multiline' if multiline else '', maxlen=900 if multiline else 120,
        )

    def frame(page):
        c.setFillColor(CREAM)
        c.rect(0, 0, 612, 792, fill=1, stroke=0)
        c.drawImage(str(WORDMARK), 44, 744, width=240, height=240 * 174 / 1551, mask='auto')
        text(440, 753, 'Free renewal worksheet', size=9, color=MUTED)
        c.setStrokeColor(LINE)
        c.setLineWidth(.6)
        c.line(44, 735, 568, 735)
        c.line(44, 70, 568, 70)
        text(44, 49, 'cloudandcapital.com/resources/software-renewal', size=8.5, color=SAGE)
        c.linkURL('https://cloudandcapital.com/resources/software-renewal', (44, 45, 360, 60))
        text(44, 33, 'Cloud & Capital  |  No signup required.', size=8, color=MUTED)
        text(542, 33, f'{page} / 2', size=8, color=MUTED)

    def question(index, y):
        q = questions[index]
        text(44, y, f'{index + 1:02}', size=10, color=SAGE)
        text(76, y, q['title'], font='BrandSerif', size=18)
        lines = simpleSplit(q['detail'], 'BrandBody', 10.25, 492)
        assert len(lines) <= 2, q['title']
        for line_index, line in enumerate(lines):
            text(76, y - 18 - line_index * 13, line, size=10.25, color=MUTED)
        field(f'q{index + 1:02}', f'{index + 1}. {q["title"]}', 76, y - 78, 492, 34, True)

    frame(1)
    text(44, 692, 'Before you renew', font='BrandSerif', size=36)
    text(44, 658, 'that software.', font='BrandItalic', size=36, color=SAGE)
    text(44, 631, 'One subscription. Eight questions. A clearer next step.', size=11)
    text(44, 613, 'Use short notes. Type in a PDF reader or print, then save a copy.', size=9.5, color=MUTED)
    text(44, 593, 'Software / plan', size=9.5, color=SAGE)
    field('software', 'Software or subscription plan', 44, 566, 330)
    text(392, 593, 'Currency on the bill', size=9.5, color=SAGE)
    field('currency', 'Currency on the bill, for example USD or EUR', 392, 566, 176)
    for name, label, x, width in [
        ('renewal_date', 'Renewal date', 44, 160),
        ('notice_deadline', 'Last day to give notice', 216, 160),
        ('next_charge_date', 'Next charge date', 388, 180),
    ]:
        text(x, 549, label, size=9.5, color=SAGE)
        field(name, label + '. Check the provider terms; write unknown if unconfirmed.', x, 522, width)
    for i in range(4):
        question(i, 498 - i * 100)
    c.showPage()

    frame(2)
    text(44, 692, 'Make the call.', font='BrandSerif', size=34)
    text(44, 665, 'Keeping it is a decision too. Write down what makes sense for this tool.', size=11)
    for i in range(4, 8):
        question(i, 617 - (i - 4) * 110)
    text(44, 176, 'Who will act? (That can be you.)', size=9.5, color=SAGE)
    field('owner', 'Person responsible for the next action', 44, 149, 330)
    text(392, 176, 'Date to decide or revisit', size=9.5, color=SAGE)
    field('revisit_date', 'Date to decide or revisit, before any relevant notice deadline', 392, 149, 176)
    text(44, 126, 'The notice deadline can be earlier than renewal. Check the provider terms.', size=9.5, color=MUTED)
    text(44, 106, 'Keep the dates in your Renewal Tracker', size=10, color=SAGE)
    c.linkURL('https://cloudandcapital.com/tools/software-renewal-tracker', (44, 101, 275, 118))
    text(326, 106, 'Need help? Technology Cost Review', size=10, color=SAGE)
    c.linkURL('https://cloudandcapital.com/services#technology-cost-review', (326, 101, 568, 118))
    c.showPage()
    c.save()

print(OUTPUT)
