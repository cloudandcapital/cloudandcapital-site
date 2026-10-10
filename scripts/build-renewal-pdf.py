from pathlib import Path
import re
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
for name,file in [("Helvetica","DejaVuSans.ttf"),("Times-Roman","DejaVuSerif.ttf"),("Times-Italic","DejaVuSerif.ttf")]:
 pdfmetrics.registerFont(TTFont(name,"/usr/share/fonts/truetype/dejavu/"+file))
from reportlab.lib.utils import simpleSplit
root=Path(__file__).resolve().parents[1]
qs=re.findall(r"title: '([^']+)', detail: '([^']+)'",(root/'src/data/softwareRenewal.ts').read_text())
assert len(qs)==8
out=root/'public/downloads/before-you-renew-that-software.pdf'
c=canvas.Canvas(str(out),pagesize=(612,792),pageCompression=1)
c.setTitle('Before you renew that software | Cloud & Capital')
c.setAuthor('Diana Molski · Cloud & Capital')
ink=HexColor('#293c31'); mute=HexColor('#68685d'); line=HexColor('#c9cabc')
def text(x,y,s,font='Helvetica',size=10,color=ink):
 c.setFillColor(color);c.setFont(font,size);c.drawString(x,y,s)
def rule(y):
 c.setStrokeColor(line);c.setLineWidth(.6);c.line(44,y,568,y)
for page in range(2):
 c.setFillColor(HexColor('#faf8f1'));c.rect(0,0,612,792,fill=1,stroke=0)
 text(44,752,'CLOUD & CAPITAL',size=10)
 text(440,752,'A decision worksheet',size=9,color=mute)
 rule(735)
 if page==0:
  text(44,687,'Before you renew',font='Times-Roman',size=34)
  text(44,651,'that software.',font='Times-Italic',size=34)
  text(44,620,'One subscription. Eight questions. A clearer next step.',size=11)
  text(44,590,'Software / plan:',size=10);c.setStrokeColor(line);c.line(125,587,355,587)
  text(374,590,'Renewal date:',size=10);c.line(438,587,568,587)
  start=547; spacing=108
 else:
  text(44,686,'Keep working through it.',font='Times-Roman',size=30)
  text(44,655,'Keep confirmed costs, estimates, and assumptions separate.',size=11)
  start=603;spacing=117
 for j,(title,detail) in enumerate(qs[page*4:page*4+4]):
  y=start-j*spacing
  text(44,y,f'{page*4+j+1:02}',size=10,color=mute)
  text(76,y,title,font='Times-Roman',size=17)
  lines=simpleSplit(detail,'Helvetica',9.5,484)
  for k,s in enumerate(lines):text(76,y-20-k*13,s,size=9.5,color=mute)
  for k in range(2):
   c.setStrokeColor(line);c.line(76,y-57-k*17,568,y-57-k*17)
 if page==1:
  text(44,106,'Next step owner:',size=9);c.line(126,103,333,103)
  text(350,106,'Revisit on:',size=9);c.line(399,103,568,103)
 rule(72)
 text(44,51,'cloudandcapital.com/resources/software-renewal',size=8,color=mute)
 text(44,37,'Diana Molski  |  Use this worksheet without signing up.',size=8,color=mute)
 c.linkURL('https://cloudandcapital.com/resources/software-renewal',(44,46,330,63))
 c.showPage()
c.save()
print(out)
