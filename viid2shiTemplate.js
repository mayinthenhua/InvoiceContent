function render_viid2shiTemplate(tables,tbody,tbody1){
    var merge_alias = page_tables.merge_alias;
    var merges = page_tables.merges;
    let isTable = false;
    let isTotal = false;
    let rowcnt=0;
    for (var r = 0; r < tables.length; r++) {
        
        tr_dom = $('<tr></tr>');
        for (var c = 0; c < tables[r].length; c++) {
            var r_c = [r, c].join('-');
            if (merge_alias[r_c]) {
                continue;
            }
            td_dom = $('<td></td>');
            if (merges[r_c]) {
                isTotal = true;
                if (merges[r_c].width > 1 && merges[r_c].width!=2) {
                    td_dom.attr('colspan', merges[r_c].width-1);
                }
                if (merges[r_c].height > 1) {
                    td_dom.attr('rowspan', merges[r_c].height);
                }
            }
            
            let cell = tables[r][c];
            
            if(cell.trim().length===0){
                
                if(r<tables[r].length){
                    r++;c=-1;
                }
                continue;
            }
            {
                if(r==0){
                    let lines = cell.split('\n');
                    let addr = findField('Address',cell);
                    let taxCode = findField('Tax Code',cell);
                    $('#company-name').text(lines[0]);
                    $('#company-address').text(addr);
                    $('#company-tax').text(taxCode);
                    if(addr.includes('Thủ Đức')){
                        let addr_short = 'A2/1A Lê Văn Việt, TP. Thủ Đức, HCM'
                        $('#company-address-short').text(addr_short);
                    }else{
                        let addr_short ='A2/1A Lê Văn Việt, quận 9,TP HCM'
                        $('#company-address-short').text(addr_short);
                    }
                }
                if(cell.includes('Invoice No')){
                    
                }
                if(cell.includes('Ngày') && cell.includes('tháng')&& cell.includes('năm')){
                    let lines = cell.split('\n');
                    const index = lines.findIndex(str => str.includes('Ngày') &&str.includes('tháng')&& str.includes('năm'));
                    const index_Invoice = lines.findIndex(str => str.includes('Invoice No'));
                    
                    let dateLine = lines[index];
                    let invoiceNoLine = lines[index_Invoice];
                    const n = dateLine.match(/\d+/g);
                    try {
                        invoiceNo = invoiceNoLine.match(/\d+/g)[0];
                    } catch (error) {
                        invoiceNo = lines[lines.length-1].replace('"','');
                    }
                    
                    if(n){
                        date.day = n[0];
                        date.month = n[1];
                        date.year = n[2];
                        let dateString = date.year+'-'+date.month+'-'+date.day;
                        let dateObject = new Date(dateString);

                        let ran = Math.floor(Math.random() * 10) + 1;
                        dateObject.setDate(dateObject.getDate() - ran);

                        var newyear = dateObject.getFullYear();
                        var newmonth = String(dateObject.getMonth() + 1).padStart(2, '0'); // Tháng 0-indexed, cần cộng 1
                        var newday = String(dateObject.getDate()).padStart(2, '0');

                        $('#order-date').text(`${newday}/${newmonth}/${newyear}`);
                        $('#date-bill').text(`Ngày ${date.day} tháng ${date.month} năm ${date.year}`);
                    }
                }
                if(cell.toLowerCase().includes('người mua') && cell.includes('Mã số thuế')&& cell.includes('Địa chỉ')){
                    let line = cell.split('\n');
                    let customerAddress;
                    let customerName;
                    let buyer;
                    for(var i=0;i<line.length;i++){
                        if(line[i].toLowerCase().includes('người mua')){
                            buyer = line[i].split(':')[1];
                            if(!line[i+1].includes(':')){
                                buyer = buyer + ' ' + line[i+1];
                            } 
                        }
                        if(line[i].includes('Company')){
                            customerName = line[i].split(':')[1];
                            if(!line[i+1].includes(':')){
                                customerName = customerName + ' ' + line[i+1];
                            } 
                        }
                        if(line[i].includes('Địa chỉ')){
                            customerAddress = line[i].split(':')[1];
                            if(!line[i+1].includes(':')){
                                customerAddress = customerAddress + ' ' + line[i+1];
                            
                            } 
                        }
                    }
                    if (customerName) {
                        $('#CustomerName').text(customerName);
                    
                    }
                    else{
                        $('#CustomerName').text(buyer);
                    }
                    if(customerAddress){
                        $('#CustomerAddress').text(customerAddress);
                    }
                }
            
            }
            //========end if(page_tables.page===1)===========
            
            if(cell.includes('STT')){
                r+=2;c=-1;
                isTable = true;
                continue;
            }
            if(cell.includes('Cộng tiền hàng (Sub total):')){
            
            }
            if(isTable===true && c!==2){
                
                
                if (merges[r_c]) {
                                                        
                    if (merges[r_c].width ===5) {
                        if(cell.includes('10%')){
                            td_dom.text(`Tiền thuế GTGT 10% (VAT amount):`);
                        }else if(cell.includes('8%')){
                            td_dom.text(`Tiền thuế GTGT 8% (VAT amount):`);
                        } else{
                            td_dom.text(cell);
                        }
                        
                        td_dom.addClass('text-right');
                        td_dom.addClass('row-sub');
                    }
                    if (merges[r_c].width ===2) {
                        const isNumber = !isNaN(tables[r][0]) && !isNaN(parseFloat(tables[r][0]));
                            if (isNumber) {
                                let pruductName =  removeLastWord(cell.trim());
                                td_dom.text(pruductName);
                                td_dom.addClass('text-left');
                            }else{
                                td_dom.html('<strong>'+cell+'</strong>');
                                td_dom.addClass('text-right');
                            }
                        
                    }
                    
                    if (merges[r_c].width ===6) {
                        let split = cell.split(':');
                        td_dom.html( 'Số tiền viết bằng chữ'+': '+'<strong>'+split[1]+'</strong>');
                        td_dom.addClass('text-left');
                        
                    }
                }else{
                    td_dom.text(cell);
                    
                    if(c===0 ||c===3){
                    td_dom.addClass('text-center');
                    }
                    else if(c===4 ||c===5){
                        
                        td_dom.addClass('text-right');
                        if(tables[r][c-1].trim()===''){
                            td_dom.html('<strong>'+cell+'</strong>');
                        }
                    }
                    else{
                        td_dom.addClass('text-left');
                    }
                }
                tr_dom.append(td_dom);
            }
            
        }
        if(isTable===true){
            let clonetr=tr_dom.clone();
            tbody.append(tr_dom);
            
            tbody1.append(clonetr);
            rowcnt++;
            
        }
        
        
    }
    let xProduct = document.getElementById("xProduct-table");
    
}
function removeLastWord(sentence) {
    const words = sentence.split(' ');
    words.pop();
    return words.join(' ');
}