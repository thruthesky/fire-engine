export class T {
    static likeFcmTitle(languageCode: string, displayName: string): string {
        if (languageCode == 'ko') {
            return `${displayName}님이 좋아요를 눌렀습니다.`;
        } else {
            return `${displayName} liked you.`;
        }
    }
    static likeFcmBody(languageCode: string, displayName: string): string {
        if (languageCode == 'ko') {
            return `${displayName}님에게 인사를 해 보세요.`;
        } else {
            return `Please, say Hi to ${displayName}.`;
        }
    }
}