"""Check the shipped worksheet and a temporary filled/save/reopen round trip."""
import argparse
import json
from pathlib import Path
from pypdf import PdfReader, PdfWriter

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--output', type=Path, required=True, help='Temporary filled QA PDF, never the public blank PDF')
args = parser.parse_args()
source = root / 'public/downloads/before-you-renew-that-software.pdf'
assert args.output.resolve() != source.resolve()
reader = PdfReader(source)
expected = ['software','currency','renewal_date','notice_deadline','next_charge_date'] + [f'q{i:02}' for i in range(1,9)] + ['owner','revisit_date']
fields = reader.get_fields() or {}
assert len(reader.pages) == 2 and not reader.is_encrypted
assert set(fields) == set(expected)
assert not reader.trailer['/Root'].get('/OpenAction')
assert not reader.trailer['/Root'].get('/Names', {}).get('/JavaScript')
refs = {f.idnum for f in reader.trailer['/Root']['/AcroForm']['/Fields']}
widgets, links = [], set()
for page in reader.pages:
    assert list(page.mediabox) == [0,0,612,792]
    page_rects=[]
    for ref in page.get('/Annots', []):
        node = ref.get_object()
        if node.get('/Subtype') == '/Link':
            assert node['/A']['/S'] == '/URI'
            links.add(str(node['/A']['/URI']))
        if node.get('/Subtype') != '/Widget': continue
        assert ref.idnum in refs, 'A widget is not attached to the canonical field tree'
        assert node.get('/TU'), 'Missing accessible field description'
        assert node.get('/AP', {}).get('/N').get_object().get_data()
        x0,y0,x1,y1=map(float,node['/Rect'])
        assert 0 <= x0 < x1 <= 612 and 70 < y0 < y1 < 735
        for a,b,c,d in page_rects:
            assert not (max(x0,a)<min(x1,c) and max(y0,b)<min(y1,d)), 'Form fields overlap'
        page_rects.append((x0,y0,x1,y1))
        widgets.append(str(node['/T']))
assert len(widgets)==15 and set(widgets)==set(expected)
assert links == {'https://cloudandcapital.com/resources/software-renewal','https://cloudandcapital.com/tools/software-renewal-tracker','https://cloudandcapital.com/services#technology-cost-review'}
question_source=(root/'src/data/softwareRenewal.ts').read_text()
questions=json.loads(question_source.removeprefix('export const renewalQuestions = ').rstrip()[:-1])
text=' '.join(' '.join(p.extract_text().split()) for p in reader.pages)
for q in questions:
    assert q['title'] in text and q['detail'] in text
values={key:f'Checked answer for {key}' for key in expected}
values.update(software='Invented workspace plan',currency='USD',renewal_date='2026-12-01',notice_deadline='2026-11-01',next_charge_date='2026-12-01',owner='QA reviewer',revisit_date='2026-10-30')
writer=PdfWriter()
writer.clone_document_from_reader(reader)
writer.update_page_form_field_values(None,values,auto_regenerate=False)
args.output.parent.mkdir(parents=True,exist_ok=True)
with args.output.open('wb') as output:writer.write(output)
reopened=PdfReader(args.output)
saved_fields=reopened.get_fields() or {}
assert set(saved_fields)==set(expected)
for key,value in values.items():assert saved_fields[key].get('/V')==value,key
for page in reopened.pages:
    for ref in page.get('/Annots',[]):
        widget=ref.get_object()
        if widget.get('/Subtype')!='/Widget':continue
        assert widget['/V']==values[str(widget['/T'])]
        assert widget['/AP']['/N'].get_object().get_data()
print(json.dumps({'pages':2,'canonical_fields':15,'page_widgets':[9,6],'question_content_matches':8,'link_targets':3,'saved_values_reopened':15,'field_appearances_checked':True,'pdf_javascript':False,'native_reader_testing':'separate'},indent=2))
