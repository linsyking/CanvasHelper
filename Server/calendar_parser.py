'''
@Author: King
@Date: 2022-05-08 21:53:28
@Email: 13321998692@163.com
@Url: https://yydbxx.cn
'''
from math import floor
import os
import json
from datetime import datetime


class CalendarParser:
    def __init__(self, hbid: str) -> None:
        self.cal = []
        self.courses = []
        self.phylab = ''
        try:
            if os.path.exists(f'./data/{hbid}/calendar.json'):
                with open(f'./data/{hbid}/calendar.json', 'r', encoding='utf-8', errors='ignore') as f:
                    self.cal = json.load(f)
        except:
            pass

    def layout_wrap(self, msg: str):
        # Layout
        return f'<div class="calendar"><div class="cal-content">{msg}<cal class="edit"><img width="30px" height="30px" src="http://yydbxx.cn/test/canvas/res/edit.svg"></img></cal></div></div>'

    def special_override(self, cl):
        # Override some courses
        if cl['courseCode'] == 'VP141':
            self.phylab = cl['lessonClassCode']
            return True
        else:
            return False

    def add_phy_week(self, weeks, dow, time):
        self.courses.append([self.phylab, weeks, dow, time])

    def special_add(self):
        if self.phylab == 'VP141SU2022-1':
            self.add_phy_week([4, 6, 9], 3, ('08:55:00', '11:40:00'))
            self.add_phy_week([2, 7], 5, ('08:55:00', '11:40:00'))
        elif self.phylab == 'VP141SU2022-2':
            self.add_phy_week([3, 5, 7, 8, 10], 3, ('08:55:00', '11:40:00'))
        elif self.phylab == 'VP141SU2022-3':
            self.add_phy_week([3, 5, 6, 8, 10], 5, ('08:55:00', '11:40:00'))
        else:
            pass

    def get_all_course_calendar(self):
        for c in self.cal:
            bgt = c['sectionBeginTime']
            edt = c['sectionEndTime']
            wk = c['week'].split(',')
            for i in range(len(wk)):
                wk[i] = int(wk[i])
            wk.sort()
            name = c['courseName']
            dw = c['dayOfWeek']
            if not self.special_override(c):
                self.courses.append([name, wk, dw, (bgt, edt)])

    def parse_time(self):
        for i in self.courses:
            bgt = datetime.strptime(i[3][0], '%H:%M:%S')
            edt = datetime.strptime(i[3][1], '%H:%M:%S')
            bgt = datetime.now().replace(hour=bgt.hour, minute=bgt.minute,
                                         second=bgt.second, microsecond=bgt.microsecond)
            edt = datetime.now().replace(hour=edt.hour, minute=edt.minute,
                                         second=edt.second, microsecond=edt.microsecond)
            i[3] = (bgt, edt)

    def cmp(self, k):
        return k[3][0].hour*60 + k[3][0].minute + k[2]*2000

    def make_prefix(self, dow, dnow):
        if dow == dnow:
            return ''
        elif dow==dnow+1:
            return '明天'
        elif dow == dnow+2:
            return '后天'
        elif dow == dnow+3:
            return '大后天'
        else:
            etc = ['一','二','三','四','五','六','日']
            return f'星期{etc[dow-1]}'


    def get_next_course(self):
        if len(self.cal) == 0:
            # No course uploaded
            prompt = '<h3>说明</h3><p>您尚未上传课表，点击右下角图标上传</p>\n<p>详细使用说明请访问Github仓库</p>'
            return self.layout_wrap(prompt)
        try:
            self.get_all_course_calendar()
            self.special_add()
            self.parse_time()
        except:
            prompt = '<h3>说明</h3><p>课表解析失败，请重新上传</p>\n<p>详细使用说明请访问Github仓库</p>'
            return self.layout_wrap(prompt)
        now = datetime.now()
        now_root = now.replace(hour=0, minute=0, second=0, microsecond=0)
        sem_begin = datetime.strptime('2022-05-9', '%Y-%m-%d')
        bdays = (now_root-sem_begin).days
        cur_week = floor(bdays/7)+1
        cur_dow = now.isoweekday()
        # Query following course
        td = None
        next = []
        for c in self.courses:
            if not cur_week in c[1]:
                continue
            time = c[3]
            if cur_dow == c[2]:
                if time[0] <= now and now <= time[1]:
                    td = c
                    break
            # print(c[0], c[2], time)
            if cur_dow < c[2] or (cur_dow == c[2] and now < time[0]):
                next.append(c)

        next.sort(key=self.cmp)
        tmsg = ''
        if td:
            bgt = td[3][0].strftime('%H:%M')
            edt = td[3][1].strftime('%H:%M')
            tmsg = f'<h3>进行中</h3><p>{td[0]}，时间：<b>{bgt} - {edt}</b></p>\n'

        if len(next) == 0:
            return self.layout_wrap('<h3>说明</h3><p>接下来本周暂时没有课程</p>')
        td = next[0]
        tbgt = td[3][0].strftime('%H:%M')
        tedt = td[3][1].strftime('%H:%M')
        pfx = self.make_prefix(td[2], cur_dow)
        tmsg+= f'<h3>接下来</h3><p>{td[0]}，时间：<b>{pfx}{tbgt} - {tedt}</b></p>\n'
        
        return self.layout_wrap(tmsg)


if __name__ == '__main__':
    s = CalendarParser("2054ec05bf03a92f9a88deeffeadae4c9a16efb6")
    print(s.get_next_course())
