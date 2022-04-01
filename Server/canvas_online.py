# coding=utf-8
'''
@Author: King
@Date: 2022-03-24 星期四 19-30-43
@Email: linsy_king@sjtu.edu.cn
@Url: http://www.yydbxx.cn
'''

from datetime import datetime, timedelta
import requests
import json
import sys
import hashlib
import os

g_out=""
g_error=False
g_tformat="relative"

def leave():
    # Error occurred, leaving
    global g_error
    g_error=True
    dump_out()
    exit(0)

def dump_out():
    # Global once
    # Cache if no error
    if not g_error:
        with open(f'./data/{hashbid}/cache.json', 'w', encoding='utf-8', errors='ignore') as f:
            f.write("<i>(Cached file, real-time data is still loading...)</i>\n"+g_out[:-1])
    else:
        if os.path.exists(f'./data/{hashbid}/cache.json'):
            os.remove(f'./data/{hashbid}/cache.json')
    print(g_out[:-1], end="")

def print_own(mystr):
    global g_out
    g_out+=mystr+"\n"

def sha1(str: str):
    return hashlib.sha1(str.encode(encoding='utf-8', errors='ignore')).hexdigest()


now = datetime.now()

def num2ch(f: int):
    s = ['一', '二', '三', '四', '五', '六', '日']
    return s[f]

def time_format_control(rtime: datetime, format):
    if(rtime<now):
        return "已过期"
    if(format=="origin"):
        return rtime
    elif format=="relative":
        return relative_date(rtime)
    else:
        # Fallback
        return rtime.strftime(format)

def get_check_status(name:str):
    # Return type
    for i in usercheck:
        if i['name']==name:
            return i['type']
    return 0

def relative_date(rtime: datetime):
    # Generate relative date like "下周五 xxx"
    # or "本周x xxx"/"明天"/"后天"
    delta = rtime.replace(hour=0, minute=0, second=0, microsecond=0) - \
        now.replace(hour=0, minute=0, second=0, microsecond=0)
    wp = int((delta.days+now.weekday())/7)
    if(wp == 0):
        # Current week
        if(delta.days == 0):
            return f"今天{rtime.strftime('%H:%M:%S')}"
        elif delta.days == 1:
            return f"明天{rtime.strftime('%H:%M:%S')}"
        elif delta.days == 2:
            return f"后天{rtime.strftime('%H:%M:%S')}"
        else:
            return f"本周{num2ch(rtime.weekday())}{rtime.strftime('%H:%M:%S')}"
    elif wp == 1:
        if delta.days == 1:
            return f"明天{rtime.strftime('%H:%M:%S')}"
        elif delta.days == 2:
            return f"后天{rtime.strftime('%H:%M:%S')}"
        return f"下周{num2ch(rtime.weekday())}{rtime.strftime('%H:%M:%S')}"
    elif wp == 2:
        return f"下下周{num2ch(rtime.weekday())}{rtime.strftime('%H:%M:%S')}"
    else:
        return f'{rtime}'


ori = sys.argv
bid = sys.argv[1]
hashbid = sha1(bid)
ucommand = ''

with open(f'./data/{hashbid}/c.json', 'r', encoding='utf-8', errors='ignore') as f:
    ucommand = json.load(f)

url = ucommand['url']
if(url[-1] == '/'):
    url = url[:-1]
if(url[:4] != 'http'):
    print_own("invalid url")
    leave()

user_custom={}
usercheck=[]

if os.path.exists(f'./data/{hashbid}/userdata.json'):
    with open(f'./data/{hashbid}/userdata.json', 'r', encoding='utf-8', errors='ignore') as f:
        user_custom = json.load(f)
if "checks" in user_custom:
    usercheck = user_custom['checks']

if "timeformat" in ucommand:
    g_tformat = ucommand['timeformat']

class apilink:
    def __init__(self, course_id, course_name, course_type, otherdata={}) -> None:
        self.headers = {
            'Authorization': f'Bearer {bid}'
        }
        self.course = course_id
        self.cname = course_name
        self.course_type = course_type
        self.assignment = f'{url}/api/v1/courses/{course_id}/assignment_groups?include[]=assignments&include[]=discussion_topic&exclude_response_fields[]=description&exclude_response_fields[]=rubric&override_assignment_dates=true'
        self.announcement = f'{url}/api/v1/courses/{course_id}/discussion_topics?only_announcements=true'
        self.discussion = f'{url}/api/v1/courses/{course_id}/discussion_topics?plain_messages=true&exclude_assignment_descriptions=true&exclude_context_module_locked_topics=true&order_by=recent_activity&include=all_dates'
        self.other=otherdata

    def dump_span(self, style, id, text):
        if(style==1):
            # Positive
            return f'<div class="single"><span class="checkbox positive" id="{id}"></span><span class="label">{text}</span></div>\n'
        elif style==2:
            # wrong
            return f'<div class="single"><span class="checkbox negative" id="{id}"></span><span class="label">{text}</span></div>\n'
        elif style==3:
            # important
            return f'<div class="single"><span class="checkbox important" id="{id}"></span><span class="label">{text}</span></div>\n'
        else:
            # Not checked
            return f'<div class="single"><span class="checkbox" id="{id}"></span><span class="label">{text}</span></div>\n'

    def send(self, url):
        return requests.get(url, headers=self.headers).content.decode(
            encoding='utf-8', errors='ignore')

    def _cmp_ass(self, el):
        return el['due_at']

    def run(self):
        t = self.course_type
        if t == "ass":
            self.collect_assignment()
        elif t == "ann":
            self.collect_announcement()
        elif t == "dis":
            self.collect_discussion()
        else:
            print_own("Error")
        self.add_custom_info()

    def add_custom_info(self):
        if('msg' in self.other):
            # Add custom message
            self.output+=f'<p>{self.other["msg"]}</p>\n'

    def collect_assignment(self):
        self.cstate = 'Assignment'
        asr = self.send(self.assignment)
        self.raw = asr
        self.ass_data = []
        asr = json.loads(asr)
        for big in asr:
            a = big['assignments']
            if a:
                for k in a:
                    if k['due_at']:
                        dttime = datetime.strptime(k['due_at'], '%Y-%m-%dT%H:%M:%SZ') + timedelta(hours=8)
                        if(dttime < now ):
                            continue
                        self.ass_data.append(k)
        self.ass_data.sort(key=self._cmp_ass, reverse=True)
        self.output = f'<h2>{self.cname}: 近期作业</h2>\n'
        maxnum = 1000
        if "maxshow" in self.other:
            maxnum = int(self.other['maxshow'])
        if(len(self.ass_data) == 0 or maxnum<=0):
            self.output += "暂无作业\n"
            return
        for ass in self.ass_data:
            if(maxnum==0):
                break
            maxnum-=1
            dttime = datetime.strptime(ass['due_at'], '%Y-%m-%dT%H:%M:%SZ') + timedelta(hours=8)
            tformat=g_tformat
            if "timeformat" in self.other:
                tformat = self.other['timeformat']
            dttime = time_format_control(dttime, tformat)
            check_type=get_check_status(f"ass{ass['id']}")
            self.output += self.dump_span(check_type,f"ass{ass['id']}",f"{ass['name']}, Due: <b>{dttime}</b>")

    def collect_announcement(self):
        self.cstate = 'Announcement'
        anr = self.send(self.announcement)
        self.raw = anr
        anr = json.loads(anr)
        self.ann_data = anr
        self.output = f'<h2>{self.cname}: 近期公告</h2>\n'
        maxnum = 4
        if("maxshow" in self.other):
            maxnum = int(self.other['maxshow']);

        if(len(anr) == 0 or maxnum<=0):
            self.output += "暂无公告\n"
            return;
        for an in anr:
            if(maxnum == 0):
                break
            maxnum -= 1
            check_type=get_check_status(f"ann{an['id']}")
            self.output+=self.dump_span(check_type, f"ann{an['id']}",an['title'])
            
    def collect_discussion(self):
        self.cstate = 'Discussion'
        dis = self.send(self.discussion)
        self.raw = dis
        dis = json.loads(dis)
        self.dis_data = []
        self.output = f'<h2>{self.cname}: 近期讨论</h2>\n'
        for d in dis:
            if d['locked']:
                continue
            self.dis_data.append(d)
        maxnum = 5
        if "maxshow" in self.other:
            maxnum = int(self.other['maxshow'])
        if(len(self.dis_data) == 0 or maxnum<=0):
            self.output += "暂无讨论\n"
            return
        for d in self.dis_data:
            if maxnum==0:
                break
            maxnum-=1
            check_type=get_check_status(f"dis{d['id']}")
            self.output+=self.dump_span(check_type,f"dis{d['id']}",d['title'])

    def error(self):
        global g_error
        g_error=True
        print_own(f'<h2>{self.cname}: 发生错误</h2>\n<p>{self.raw}</p>\n')

    def print_out(self):
        print_own(self.output)


courses = ucommand['courses']
allc = []

try:
    for course in courses:
        allc.append(apilink(course['course_id'],
                    course['course_name'], course['type'], course))
except:
    print_own('invalid courses')
    leave()

now_root = now.replace(hour=0,minute=0,second=0,microsecond=0)

sem_begin=datetime.strptime('2022-02-14', '%Y-%m-%d')

bdays = (now_root-sem_begin).days

bweeks = int(bdays/7)+1

if "title" in ucommand:
    print_own(f"<h1>{ucommand['title']} - 第{bweeks}周</h1>")
else:
    print_own(f"<h1>Canvas 通知 - 第{bweeks}周</h1>")
for i in allc:
    try:
        i.run()
    except:
        i.error()

for i in allc:
    i.print_out()

dump_out()
