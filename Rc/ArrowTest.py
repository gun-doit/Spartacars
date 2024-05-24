import curses

def main(stdscr):
    # curses 초기화
    stdscr.clear()
    stdscr.refresh()
    curses.cbreak()  # 문자 입력 버퍼 없이 문자를 즉시 반환합니다.
    stdscr.nodelay(1)  # 비차단(non-blocking) 모드로 설정합니다.

    # 메인 루프
    stdscr.addstr(0, 0, "Press q to quit.")
    while True:
        key = stdscr.getch()
        if key == ord('q'):
            break
        elif key != -1:
            # 키 입력이 발생한 경우
            stdscr.addstr(1, 0, "You pressed: " + chr(key))
            stdscr.refresh()

# curses 초기화 및 main 함수 호출
curses.wrapper(main)
