import toolbarIcon from './assets/toolbaricon.svg?raw';
import libraryIcon from './assets/libraryicon.svg?raw';

miro.onReady(() => {
    miro.initialize({
        extensionPoints: {
            toolbar: {
                title: 'Ideas by AI',
                toolbarSvgIcon: toolbarIcon,
                librarySvgIcon: libraryIcon,
                async onClick() {
                    await miro.board.ui.openLibrary('app.html', {
                        title: 'Ideas by AI',
                    });
                    // console.log(miro.enums.event)
                    miro.showNotification('Get some idea from GPT-3.')
                },
            },
        },
    });
});
