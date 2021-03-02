let TerminationFormConfigData = {
    notifiedSuperiors: {
        options: [
            { value: 'left the organization at mutually acceptable terms', isSelected: false },
            { value: 'left the organization for personal reasons', isSelected: false }
        ]
    },
    absconded: {
        options: [
            { value: 'employee absconded along with company property', isSelected: false },
            { value: 'employee absconded without any notice', isSelected: false }
        ]
    },

    terminated: {
        options: [
            { value: 'terminated due to performance issues', isSelected: false },
            { value: 'terminated due to trust & safety issues', isSelected: false },
            { value: 'terminated due to customer complaints', isSelected: false },
            { value: 'terminated due to misconduct', isSelected: false }
        ]
    }

}
export default TerminationFormConfigData;